import { z } from "zod";

const cloudflareEnvSchema = z.object({
  ENVIRONMENT: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
  // SUPABASE_URL: z.string().min(1),
  // SUPABASE_ANON_KEY: z.string().min(1),
  // SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  // SMN_KV: z
  //   .record(z.unknown())
  //   .transform((obj) => obj as unknown as KVNamespace),
  // SMN_R2: z.record(z.unknown()).transform((obj) => obj as unknown as R2Bucket),
});

export type CloudflareEnv = z.infer<typeof cloudflareEnvSchema>;

export function assertCloudflareEnv(
  obj: unknown,
): asserts obj is CloudflareEnv {
  cloudflareEnvSchema.parse(obj);
}

/**
 * Attached to window and contains browser env vars so no secrets.
 * See window.d.ts.
 */
export type CloudflareBrowserEnv = Pick<
  CloudflareEnv,
  "ENVIRONMENT"
  // | "SUPABASE_URL" | "SUPABASE_ANON_KEY"
>;

export type FormServerError = {
  formErrors: string[];
  fieldErrors: Record<string, string[]>;
};