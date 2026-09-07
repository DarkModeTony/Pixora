import { createClient, createAdminClient } from "@insforge/sdk";

const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL || "https://uji68esc.us-east.insforge.app";
const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || "";
const apiKey = process.env.INSFORGE_API_KEY || "";

if (!baseUrl || !anonKey) {
  console.warn(
    "InsForge client initialized without NEXT_PUBLIC_INSFORGE_URL or NEXT_PUBLIC_INSFORGE_ANON_KEY. Please verify your .env.local file."
  );
}

export const insforge = createClient({
  baseUrl,
  anonKey,
});

export const insforgeAdmin = apiKey
  ? createAdminClient({
      baseUrl,
      apiKey,
    })
  : insforge;

