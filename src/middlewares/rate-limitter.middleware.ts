/**
 * Rate limiting middleware using express-rate-limit.
 * Provides default and email verification rate limiters with custom error handling.
 */
import {
  rateLimit,
  type RateLimitRequestHandler,
} from "express-rate-limit"
import { RATE_DELAY, RATE_LIMIT } from "@config/index";
import { HttpExceptionTooManyRequests } from "@/exceptions/HttpException";

/**
 * Limitter class provides rate limiting strategies for API endpoints.
 */
class Limitter {
  /**
   * Default rate limiter for general requests.
   * - windowMs: Delay in ms (from config, in minutes)
   * - max: Max requests per window (from config)
   * - keyGenerator: Uses IP address
   * - handler: Throws custom TooManyRequests exception
   */
  public default = (): RateLimitRequestHandler => {
    const delay = Number(RATE_DELAY) * 60 * 1000; // 1 menit

    return rateLimit({
      windowMs: delay, 
      max: Number(RATE_LIMIT),
      keyGenerator: (req) => req.ip, 
      handler: () => {
        throw new HttpExceptionTooManyRequests(
          [`Too many requests from this IP, please try again after ${RATE_DELAY} minutes`],
        );
      },
    });
  };

  /**
   * Rate limiter for email verification requests.
   * - windowMs: 3 minutes
   * - max: 5 requests per window
   * - keyGenerator: Uses IP address
   * - handler: Throws custom TooManyRequests exception
   */
  public emailVerification = (): RateLimitRequestHandler => {
    const delay = 3 * 60 * 1000; // 3 menit

    return rateLimit({
      windowMs: delay, 
      max: 5,
      keyGenerator: (req) => req.ip, 
      handler: () => {
        throw new HttpExceptionTooManyRequests(
          ["Too many requests from this IP, please try again after 5 minutes"],
        );
      },
    });
  };
}

export default Limitter;