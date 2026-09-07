import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { insforgeAdmin } from "@/lib/insforge";

export const SUBSCRIPTION_PLANS: Record<
  string,
  { name: "basic" | "pro"; label: string; amountPaise: number; credits: number }
> = {
  basic: {
    name: "basic",
    label: "Basic Plan",
    amountPaise: 99900, // ₹999
    credits: 350,
  },
  pro: {
    name: "pro",
    label: "Pro Plan",
    amountPaise: 279900, // ₹2,799
    credits: 1000,
  },
};

export async function POST(req: NextRequest) {
  try {
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Razorpay keys are not configured on server" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { planName, userId, userName, userEmail } = body;

    if (!planName || !SUBSCRIPTION_PLANS[planName.toLowerCase()]) {
      return NextResponse.json(
        { error: `Invalid plan name '${planName}'. Supported: basic, pro` },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required to initiate subscription" },
        { status: 400 }
      );
    }

    const planConfig = SUBSCRIPTION_PLANS[planName.toLowerCase()];
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    // Create Razorpay Order
    // Note: receipt max 40 chars
    const shortReceipt = `sub_${Date.now().toString().slice(-8)}_${userId.slice(0, 8)}`;
    const order = await razorpay.orders.create({
      amount: planConfig.amountPaise,
      currency: "INR",
      receipt: shortReceipt,
      notes: {
        plan: planConfig.name,
        user_id: userId,
        credits: planConfig.credits.toString(),
      },
    });

    // Record pending transaction in subscription_history
    try {
      await insforgeAdmin.database.from("subscription_history").insert([
        {
          user_id: userId,
          plan: planConfig.name,
          amount_paise: planConfig.amountPaise,
          razorpay_order_id: order.id,
          status: "pending",
        },
      ]);
    } catch (dbErr) {
      console.warn("Could not insert subscription_history record:", dbErr);
    }

    return NextResponse.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      checkoutOptions: {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Pixora AI Studio",
        description: `Pixora ${planConfig.label} Subscription (Monthly)`,
        order_id: order.id,
        prefill: {
          name: userName || "",
          email: userEmail || "",
        },
        theme: {
          color: "#9333ea",
        },
        notes: {
          plan: planConfig.name,
          user_id: userId,
        },
      },
    });
  } catch (error: any) {
    console.error("Error creating subscription order:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create subscription order" },
      { status: 500 }
    );
  }
}
