import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { insforgeAdmin } from "@/lib/insforge";
import { SUBSCRIPTION_PLANS } from "../create-subscription-order/route";

export async function POST(req: NextRequest) {
  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json(
        { error: "RAZORPAY_KEY_SECRET is not configured on server" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      planName,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing required payment verification fields" },
        { status: 400 }
      );
    }

    if (!userId || !planName) {
      return NextResponse.json(
        { error: "userId and planName are required for verification" },
        { status: 400 }
      );
    }

    const planConfig = SUBSCRIPTION_PLANS[planName.toLowerCase()];
    if (!planConfig) {
      return NextResponse.json(
        { error: `Unknown subscription plan '${planName}'` },
        { status: 400 }
      );
    }

    // Verify HMAC-SHA256 signature
    const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isValid = crypto.timingSafeEqual(
      Buffer.from(generatedSignature, "utf-8"),
      Buffer.from(razorpay_signature, "utf-8")
    );

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid payment signature. Verification failed." },
        { status: 400 }
      );
    }

    // Calculate expiry (30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Fetch current user credits from public.users
    let currentCredits = 50;
    try {
      const { data: userRow } = await insforgeAdmin.database
        .from("users")
        .select("credits")
        .eq("id", userId)
        .single();

      if (userRow && typeof userRow.credits === "number") {
        currentCredits = userRow.credits;
      }
    } catch (err) {
      console.warn("Could not fetch existing credits for user:", err);
    }

    const newCredits = currentCredits + planConfig.credits;

    // Update public.users table with new subscription plan & credits
    const { error: userUpdateError } = await insforgeAdmin.database
      .from("users")
      .update({
        plan: planConfig.name,
        plan_expires_at: expiresAt.toISOString(),
        plan_credits_per_month: planConfig.credits,
        credits: newCredits,
        subscription_razorpay_order_id: razorpay_order_id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (userUpdateError) {
      console.error("Failed to update user subscription in DB:", userUpdateError);
      return NextResponse.json(
        { error: "Failed to apply subscription to user account." },
        { status: 500 }
      );
    }

    // Update subscription_history record
    try {
      await insforgeAdmin.database
        .from("subscription_history")
        .update({
          status: "paid",
          paid_at: new Date().toISOString(),
          razorpay_payment_id: razorpay_payment_id,
        })
        .eq("razorpay_order_id", razorpay_order_id);
    } catch (historyErr) {
      console.warn("Could not update subscription_history record:", historyErr);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully upgraded to ${planConfig.label}!`,
      plan: planConfig.name,
      planLabel: planConfig.label,
      creditsAdded: planConfig.credits,
      newCredits,
      expiresAt: expiresAt.toISOString(),
      paymentId: razorpay_payment_id,
    });
  } catch (error: any) {
    console.error("Payment verification failed:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error during verification" },
      { status: 500 }
    );
  }
}
