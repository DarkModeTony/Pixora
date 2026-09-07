import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@insforge/sdk";

const insforgeAdmin = createAdminClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
  apiKey: process.env.INSFORGE_API_KEY!,
});

// Credit amounts per package name
const PACKAGE_CREDITS: Record<string, number> = {
  "Starter Boost": 100,
  "Creator Pro": 500,
  "Studio Enterprise": 2000,
};

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      packageName,
    } = await req.json();

    // Validate required fields
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return NextResponse.json(
        { error: "Missing payment fields." },
        { status: 400 }
      );
    }

    // STEP 1: Verify Razorpay signature using HMAC-SHA256
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.warn("[verify-payment] Signature mismatch for order:", razorpay_order_id);
      return NextResponse.json(
        { error: "Payment verification failed. Invalid signature." },
        { status: 400 }
      );
    }

    // STEP 2: Credit top-up — update user's credits in the database
    if (userId && packageName && PACKAGE_CREDITS[packageName]) {
      const creditsToAdd = PACKAGE_CREDITS[packageName];

      // Fetch current credits
      const { data: userData, error: fetchErr } = await insforgeAdmin.database
        .from("users")
        .select("credits")
        .eq("id", userId)
        .single();

      if (!fetchErr && userData) {
        const newCredits = (userData.credits ?? 0) + creditsToAdd;

        await insforgeAdmin.database
          .from("users")
          .update({ credits: newCredits })
          .eq("id", userId);
      }

      // Log the payment transaction
      await insforgeAdmin.database.from("payments").insert([
        {
          user_id: userId,
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          package_name: packageName,
          credits_added: creditsToAdd,
          status: "success",
        },
      ]).catch((e: unknown) => {
        // payments table may not exist yet — log but don't fail
        console.warn("[verify-payment] Could not log payment:", e);
      });
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified and credits added.",
    });
  } catch (error: unknown) {
    console.error("[verify-payment] Error:", error);
    const msg =
      error instanceof Error ? error.message : "Verification failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
