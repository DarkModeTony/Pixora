import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@insforge/sdk";
import fs from "fs";
import path from "path";

const INSFORGE_URL =
  process.env.NEXT_PUBLIC_INSFORGE_URL ?? "https://uji68esc.us-east.insforge.app";
const INSFORGE_API_KEY = process.env.INSFORGE_API_KEY ?? "";
const YOUCAM_API_KEY = process.env.YOUCAM_API_KEY ?? "";
const YOUCAM_BASE = "https://yce-api-01.perfectcorp.com/s2s/v2.0";
const CREDITS_PER_GENERATION = 5;

const insforgeAdmin = createAdminClient({
  baseUrl: INSFORGE_URL,
  apiKey: INSFORGE_API_KEY,
});

/** Convert input (base64 data URI, local /public path, or remote URL) to a raw Buffer + metadata */
async function toBuffer(
  imgInput: string
): Promise<{ buf: Buffer; ext: string; contentType: string }> {
  let buf: Buffer;
  let ext = "jpg";

  if (imgInput.startsWith("data:image/")) {
    const match = imgInput.match(/^data:image\/([a-zA-Z0-9]+);base64,/);
    if (match) ext = match[1] === "jpeg" ? "jpg" : match[1];
    const b64 = imgInput.replace(/^data:image\/[a-zA-Z0-9]+;base64,/, "");
    buf = Buffer.from(b64, "base64");
  } else if (imgInput.startsWith("/")) {
    // Local file inside public folder
    const localPath = path.join(process.cwd(), "public", imgInput);
    if (!fs.existsSync(localPath))
      throw new Error(`Local file not found: ${imgInput}`);
    buf = fs.readFileSync(localPath);
    ext = path.extname(imgInput).replace(".", "") || "jpg";
  } else if (imgInput.startsWith("http")) {
    const res = await fetch(imgInput);
    if (!res.ok) throw new Error(`Failed to fetch image: ${imgInput}`);
    buf = Buffer.from(await res.arrayBuffer());
    if (imgInput.includes(".png")) ext = "png";
    else if (imgInput.includes(".webp")) ext = "webp";
  } else {
    throw new Error("Invalid image format provided");
  }

  if (ext === "jpg") ext = "jpeg";
  const contentType = `image/${ext}`;
  return { buf, ext, contentType };
}

/**
 * Upload a file to YouCam via their 2-step presigned upload flow.
 * Returns the file_id to use in task requests.
 */
async function uploadToYoucam(
  uploadEndpoint: string, // e.g. "/file/mu-transfer"
  imgInput: string,
  fileName = "source.jpg"
): Promise<string> {
  const { buf, ext, contentType } = await toBuffer(imgInput);
  const actualFileName = fileName.replace(/\.[^.]+$/, `.${ext === "jpeg" ? "jpg" : ext}`);

  // Step 1: Request presigned upload URL + file_id
  const initRes = await fetch(`${YOUCAM_BASE}${uploadEndpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${YOUCAM_API_KEY}`,
    },
    body: JSON.stringify({
      files: [
        {
          content_type: contentType,
          file_name: actualFileName,
          file_size: buf.byteLength,
        },
      ],
    }),
  });

  const initJson = await initRes.json();
  if (!initRes.ok || initJson.status !== 200) {
    throw new Error(
      `YouCam file init error (${initJson.status || initRes.status}): ${
        initJson.error_message || initJson.error || JSON.stringify(initJson)
      }`
    );
  }

  const fileEntry = initJson.data?.files?.[0];
  if (!fileEntry?.file_id || !fileEntry?.requests?.[0]?.url) {
    throw new Error(
      `YouCam file init returned unexpected shape: ${JSON.stringify(initJson.data)}`
    );
  }

  const { file_id, requests } = fileEntry;
  const { url: presignedUrl, headers: presignedHeaders } = requests[0];

  // Step 2: PUT raw binary to the presigned URL
  const putRes = await fetch(presignedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(buf.byteLength),
      ...(presignedHeaders || {}),
    },
    body: new Uint8Array(buf),
  });

  if (!putRes.ok) {
    throw new Error(
      `YouCam presigned PUT failed (${putRes.status}): ${await putRes.text()}`
    );
  }

  return file_id;
}

/** POST a YouCam task and return data */
async function youcamPost(endpoint: string, body: object) {
  const res = await fetch(`${YOUCAM_BASE}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${YOUCAM_API_KEY}`,
    },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok || json.status !== 200) {
    throw new Error(
      `YouCam error (${json.status || res.status}): ${
        json.error_message || json.error || JSON.stringify(json)
      }`
    );
  }
  return json.data;
}

/** Poll a YouCam task endpoint until done or timeout */
async function youcamPoll(
  endpoint: string,
  taskId: string,
  maxMs = 120000
): Promise<string> {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    await new Promise((r) => setTimeout(r, 2000));
    const res = await fetch(`${YOUCAM_BASE}${endpoint}/${taskId}`, {
      headers: { Authorization: `Bearer ${YOUCAM_API_KEY}` },
    });
    const json = await res.json();
    const d = json.data;
    if (
      (d?.task_status === "done" || d?.task_status === "success") &&
      d?.results?.url
    ) {
      return d.results.url;
    }
    if (d?.task_status === "error") {
      throw new Error(
        `YouCam processing error: ${d.error_message || d.error || "Generation failed"}`
      );
    }
  }
  throw new Error("Generation timed out. Please try again with a clearer photo.");
}

/**
 * Save a remote URL (e.g. YouCam result) to InsForge Storage and return the stored URL.
 * Only used for OUTPUT images (results), not inputs.
 */
async function saveResultToInsforge(
  remoteUrl: string,
  userId: string
): Promise<{ url: string; key: string }> {
  const res = await fetch(remoteUrl);
  if (!res.ok) throw new Error(`Failed to fetch YouCam result: ${remoteUrl}`);
  const buf = Buffer.from(await res.arrayBuffer());

  // Detect extension from content-type or URL
  const ct = res.headers.get("content-type") || "image/jpeg";
  const ext = ct.includes("png") ? "png" : ct.includes("webp") ? "webp" : "jpg";
  const key = `outputs/${userId}/${Date.now()}_result.${ext}`;
  const contentType = ct;

  const blob = new Blob([new Uint8Array(buf)], { type: contentType });
  const file = new File([blob], `result.${ext}`, { type: contentType });

  const { data, error } = await insforgeAdmin.storage
    .from("generations")
    .upload(key, file);

  if (error || !data) {
    // Fall back to the YouCam CDN URL if storage upload fails
    console.warn("[Beauty API] InsForge storage upload failed, using YouCam URL:", error);
    return { url: remoteUrl, key: key };
  }

  return { url: (data as { url: string }).url, key };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tool, sourceImageBase64, sourceImageUrl, look, userId } = body as {
      tool: "makeup-transfer" | "makeup-tryon" | "eye-color";
      sourceImageBase64?: string;
      sourceImageUrl?: string;
      look: {
        templateId?: string;
        referenceUrl?: string;
        referenceBase64?: string;
        eyeLensUrl?: string;
        intensity?: number;
        enlargement?: number;
      };
      userId?: string;
    };

    if (!userId) {
      return NextResponse.json(
        {
          error: "Please sign in to generate and claim your 50 free credits!",
          code: "AUTH_REQUIRED",
        },
        { status: 401 }
      );
    }

    if (!tool || (!sourceImageBase64 && !sourceImageUrl)) {
      return NextResponse.json(
        { error: "Missing required tool or source image" },
        { status: 400 }
      );
    }

    // 1. Verify User & Credits
    const { data: userRow, error: userErr } = await insforgeAdmin.database
      .from("users")
      .select("credits")
      .eq("id", userId)
      .single();

    if (userErr || !userRow) {
      return NextResponse.json(
        { error: "User account not found. Please sign in again." },
        { status: 404 }
      );
    }

    const currentCredits = userRow.credits ?? 0;
    if (currentCredits < CREDITS_PER_GENERATION) {
      return NextResponse.json(
        {
          error: `Insufficient credits. You need ${CREDITS_PER_GENERATION} credits (you have ${currentCredits}).`,
          creditsRemaining: currentCredits,
        },
        { status: 402 }
      );
    }

    // 2. Upload source image directly to YouCam (bypass InsForge storage for inputs)
    const rawSource = sourceImageBase64 || sourceImageUrl!;

    // Determine upload endpoint based on tool
    const uploadEndpointMap = {
      "makeup-transfer": "/file/mu-transfer",
      "makeup-tryon": "/file/look-vto",
      "eye-color": "/file/eye-color-vto",
    };
    const uploadEndpoint = uploadEndpointMap[tool];

    const srcFileId = await uploadToYoucam(uploadEndpoint, rawSource, "source.jpg");

    // 3. Dispatch to YouCam using file_id
    let resultYoucamUrl: string;

    if (tool === "makeup-tryon") {
      const templateId = look?.templateId || "all_blush_beauty";
      const d = await youcamPost("/task/look-vto", {
        src_file_id: srcFileId,
        template_id: templateId,
      });
      resultYoucamUrl = await youcamPoll("/task/look-vto", d.task_id);
    } else if (tool === "makeup-transfer") {
      const rawRef =
        look?.referenceBase64 ||
        look?.referenceUrl ||
        "/makeup-transfer/webp_makeup_transfer_01.png";
      const refFileId = await uploadToYoucam(
        "/file/mu-transfer",
        rawRef,
        "reference.png"
      );
      const d = await youcamPost("/task/mu-transfer", {
        src_file_id: srcFileId,
        ref_file_id: refFileId,
      });
      resultYoucamUrl = await youcamPoll("/task/mu-transfer", d.task_id);
    } else if (tool === "eye-color") {
      const rawLens =
        look?.eyeLensUrl || "/eye-lens/webp_eye_len_01.png";
      const lensFileId = await uploadToYoucam(
        "/file/eye-color-vto",
        rawLens,
        "lens.png"
      );
      const d = await youcamPost("/task/eye-color-vto", {
        version: "1.0",
        src_file_id: srcFileId,
        ref_file_id: lensFileId,
        effect: {
          intensity: look?.intensity ?? 85,
          enlargement: look?.enlargement ?? 0,
          skin_smooth_color_intensity: 40,
          skin_smooth_strength: 30,
        },
      });
      resultYoucamUrl = await youcamPoll("/task/eye-color-vto", d.task_id);
    } else {
      return NextResponse.json({ error: "Invalid tool requested" }, { status: 400 });
    }

    // 4. Save result to InsForge Storage
    const { url: finalStoredUrl, key: storageKey } = await saveResultToInsforge(
      resultYoucamUrl,
      userId
    );

    // 5. Deduct Credits
    const newCredits = Math.max(0, currentCredits - CREDITS_PER_GENERATION);
    await insforgeAdmin.database
      .from("users")
      .update({ credits: newCredits, updated_at: new Date().toISOString() })
      .eq("id", userId);

    // 6. Record Generation in DB
    await insforgeAdmin.database.from("generations").insert([
      {
        user_id: userId,
        tool,
        source_image_url: rawSource.startsWith("data:") ? "[base64-uploaded]" : rawSource,
        reference_image_url: look?.referenceUrl || look?.eyeLensUrl || null,
        result_image_url: finalStoredUrl,
        storage_key: storageKey,
        options: look,
        credits_used: CREDITS_PER_GENERATION,
      },
    ]);

    return NextResponse.json({
      success: true,
      resultUrl: finalStoredUrl,
      creditsRemaining: newCredits,
    });
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : "Unknown error during generation";
    console.error("[Beauty Generate API Error]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
