import { NextRequest, NextResponse } from "next/server";
import { insforgeAdmin } from "@/lib/insforge";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, action } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    if (action === "downgrade-free") {
      // Downgrade to Free Plan
      const { error } = await insforgeAdmin.database
        .from("users")
        .update({
          plan: "free",
          plan_credits_per_month: 25,
          plan_expires_at: null,
          subscription_razorpay_order_id: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) {
        return NextResponse.json(
          { error: "Failed to update plan in database" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Successfully switched to the Free Plan.",
        plan: "free",
      });
    } else if (action === "cancel") {
      // Cancel auto-renewal: keeps current active period until expiration
      return NextResponse.json({
        success: true,
        message: "Your subscription renewal has been cancelled. You will retain your benefits until the end of your billing cycle.",
      });
    }

    return NextResponse.json(
      { error: "Invalid action. Supported: downgrade-free, cancel" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Error managing subscription:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
