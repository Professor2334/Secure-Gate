import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid connection string"),
  NEXTAUTH_SECRET: z.string().min(8, "NEXTAUTH_SECRET must be at least 8 characters"),
  NEXTAUTH_URL: z.string().url("NEXTAUTH_URL must be a valid URL").default("http://localhost:3000"),
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM: z.string().default("onboarding@resend.dev"),
  UPSTASH_REDIS_REST_URL: z.string().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
});

// Safe parser to prevent build crashes while providing clear warning diagnostics
const getValidatedEnv = () => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("❌ Invalid environment variables configuration:");
    console.error(JSON.stringify(result.error.format(), null, 2));

    // Throw exception in production, but fail-open with warnings in dev/test to allow local setup
    if (process.env.NODE_ENV === "production") {
      throw new Error("Invalid environment variables. Fix configuration before starting application.");
    }
  }

  return {
    DATABASE_URL: process.env.DATABASE_URL || "",
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "",
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM: process.env.RESEND_FROM || "onboarding@resend.dev",
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  };
};

export const env = getValidatedEnv();
export default env;
