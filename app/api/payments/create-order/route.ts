import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const { amount, packageName } = await req.json();

    // Validate amount (must be >= 100 paise = ₹1)
    if (!amount || typeof amount !== "number" || amount < 100) {
      return NextResponse.json(
        { error: "Invalid amount. Minimum is 100 paise." },
        { status: 400 }
      );
    }

    const receipt = `pixora_${packageName
      ?.toLowerCase()
      .replace(/\s+/g, "_")}_${Date.now()}`;

    const order = await razorpay.orders.create({
      amount, // in paise
      currency: "INR",
      receipt,
    });

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    });
  } catch (error: unknown) {
    console.error("[create-order] Razorpay error:", error);
    const msg =
      error instanceof Error ? error.message : "Failed to create order";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
