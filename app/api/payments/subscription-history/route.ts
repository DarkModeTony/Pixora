import { NextRequest, NextResponse } from "next/server";
import { insforgeAdmin } from "@/lib/insforge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId parameter is required" },
        { status: 400 }
      );
    }

    const { data: history, error } = await insforgeAdmin.database
      .from("subscription_history")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error fetching subscription history:", error);
      return NextResponse.json({ history: [] });
    }

    return NextResponse.json({ history: history || [] });
  } catch (err: any) {
    console.error("Error in subscription history API:", err);
    return NextResponse.json({ history: [] });
  }
}
