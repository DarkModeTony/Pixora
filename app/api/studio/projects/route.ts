import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@insforge/sdk";

const INSFORGE_URL =
  process.env.NEXT_PUBLIC_INSFORGE_URL ?? "https://uji68esc.us-east.insforge.app";
const INSFORGE_API_KEY = process.env.INSFORGE_API_KEY ?? "";

const insforgeAdmin = createAdminClient({
  baseUrl: INSFORGE_URL,
  apiKey: INSFORGE_API_KEY,
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(20, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const tool = searchParams.get("tool");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required to fetch projects", code: "AUTH_REQUIRED" },
        { status: 401 }
      );
    }

    const fromIndex = (page - 1) * limit;
    const toIndex = fromIndex + limit - 1;

    let query = insforgeAdmin.database
      .from("generations")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(fromIndex, toIndex);

    if (tool && tool !== "all") {
      query = query.eq("tool", tool);
    }

    const { data, count, error } = await query;

    if (error) {
      console.error("[Projects API Error]", error);
      return NextResponse.json(
        { error: error.message || "Failed to fetch generations" },
        { status: 500 }
      );
    }

    const total = count ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / limit));

    return NextResponse.json({
      success: true,
      generations: data || [],
      total,
      page,
      limit,
      totalPages,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    console.error("[Projects API Error]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const userId = searchParams.get("userId");

    if (!id || !userId) {
      return NextResponse.json(
        { error: "Missing required generation id or userId" },
        { status: 400 }
      );
    }

    // 1. Fetch item to get storage key
    const { data: item } = await insforgeAdmin.database
      .from("generations")
      .select("storage_key, user_id")
      .eq("id", id)
      .single();

    if (!item || item.user_id !== userId) {
      return NextResponse.json(
        { error: "Generation not found or unauthorized" },
        { status: 404 }
      );
    }

    // 2. Remove file from storage if key exists
    if (item.storage_key) {
      try {
        await insforgeAdmin.storage.from("generations").remove([item.storage_key]);
      } catch (storageErr) {
        console.warn("[Projects Delete] Failed to remove storage file:", storageErr);
      }
    }

    // 3. Delete database record
    const { error } = await insforgeAdmin.database
      .from("generations")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
