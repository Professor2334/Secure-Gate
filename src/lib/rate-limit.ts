import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "@/lib/env";

const redisUrl = env.UPSTASH_REDIS_REST_URL;
const redisToken = env.UPSTASH_REDIS_REST_TOKEN;

const redis = redisUrl && redisToken
  ? new Redis({
      url: redisUrl,
      token: redisToken,
    })
  : null;

// Create rate limiter instance: 5 requests per 10 minutes
export const authRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "10 m"),
      analytics: true,
      prefix: "@upstash/ratelimit/auth",
    })
  : null;

/**
 * Performs rate limit checks on a given identifier (e.g. IP + endpoint)
 * @returns Object with check status (success: boolean) and remaining counts.
 */
export async function checkRateLimit(
  ip: string,
  keyPrefix: string
): Promise<{ success: boolean; limit?: number; remaining?: number; reset?: number }> {
  if (!authRateLimiter) {
    // Fail-open during development if Redis is not configured
    console.warn(
      `[RATE LIMIT] Upstash Redis credentials not configured. Bypassing check for key [${keyPrefix}:${ip}]`
    );
    return { success: true };
  }

  try {
    const identifier = `${keyPrefix}:${ip}`;
    const result = await authRateLimiter.limit(identifier);
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  } catch (error) {
    // Fail-open defensively so Redis connection issues don't take down the auth service
    console.error("[RATE LIMIT] Connection or validation failure:", error);
    return { success: true };
  }
}
export default checkRateLimit;
