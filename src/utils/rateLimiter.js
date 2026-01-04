/**
 * Rate Limiting Utility
 * 
 * This module implements client-side rate limiting to prevent abuse and DoS attacks.
 * It tracks request counts per IP/user and enforces sensible limits.
 * 
 * Security Implementation:
 * - Prevents brute force attacks on authentication endpoints
 * - Limits rapid-fire requests that could overwhelm the server
 * - Graceful degradation with informative error messages
 * - Returns 429 status equivalent when limits are exceeded
 * 
 * OWASP Best Practices Applied:
 * - Rate limiting on sensitive operations (login, registration, password reset)
 * - Time-window based limiting
 * - User feedback on rate limit violations
 */

class RateLimiter {
  constructor() {
    // Store for tracking requests: key -> {count, resetTime}
    this.requests = new Map();
    
    // Default limits (requests per time window)
    this.limits = {
      login: { maxRequests: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
      register: { maxRequests: 3, windowMs: 60 * 60 * 1000 }, // 3 attempts per hour
      passwordReset: { maxRequests: 3, windowMs: 60 * 60 * 1000 }, // 3 attempts per hour
      default: { maxRequests: 10, windowMs: 60 * 1000 } // 10 requests per minute
    };
  }

  /**
   * Generates a unique key for tracking requests
   * @param {string} action - The action being rate limited (e.g., 'login', 'register')
   * @param {string} identifier - User identifier (email, username, or IP)
   * @returns {string} - Unique key for tracking
   */
  _generateKey(action, identifier) {
    return `${action}:${identifier}`;
  }

  /**
   * Checks if a request should be allowed based on rate limits
   * @param {string} action - The action being performed
   * @param {string} identifier - User identifier
   * @returns {Object} - {allowed: boolean, retryAfter: number|null, message: string|null}
   */
  checkLimit(action, identifier) {
    const key = this._generateKey(action, identifier);
    const now = Date.now();
    const limit = this.limits[action] || this.limits.default;

    // Get or initialize request tracking for this key
    let requestData = this.requests.get(key);

    // If no data exists or the window has expired, create new tracking
    if (!requestData || now > requestData.resetTime) {
      requestData = {
        count: 0,
        resetTime: now + limit.windowMs
      };
      this.requests.set(key, requestData);
    }

    // Increment request count
    requestData.count++;

    // Check if limit is exceeded
    if (requestData.count > limit.maxRequests) {
      const retryAfter = Math.ceil((requestData.resetTime - now) / 1000); // seconds
      return {
        allowed: false,
        retryAfter,
        message: `Too many attempts. Please try again in ${Math.ceil(retryAfter / 60)} minutes.`
      };
    }

    return {
      allowed: true,
      retryAfter: null,
      message: null
    };
  }

  /**
   * Resets rate limit for a specific action and identifier
   * @param {string} action - The action to reset
   * @param {string} identifier - User identifier
   */
  reset(action, identifier) {
    const key = this._generateKey(action, identifier);
    this.requests.delete(key);
  }

  /**
   * Clears all rate limit data (useful for testing or admin operations)
   */
  clearAll() {
    this.requests.clear();
  }

  /**
   * Cleanup expired entries to prevent memory leaks
   * Should be called periodically
   */
  cleanup() {
    const now = Date.now();
    for (const [key, data] of this.requests.entries()) {
      if (now > data.resetTime) {
        this.requests.delete(key);
      }
    }
  }
}

// Create singleton instance
const rateLimiter = new RateLimiter();

// Run cleanup every 5 minutes to prevent memory buildup
setInterval(() => {
  rateLimiter.cleanup();
}, 5 * 60 * 1000);

/**
 * Higher-order function to wrap async functions with rate limiting
 * @param {Function} fn - Async function to wrap
 * @param {string} action - Action name for rate limiting
 * @param {Function} getIdentifier - Function to extract identifier from arguments
 * @returns {Function} - Wrapped function with rate limiting
 */
export const withRateLimit = (fn, action, getIdentifier) => {
  return async (...args) => {
    const identifier = getIdentifier(...args);
    const limitCheck = rateLimiter.checkLimit(action, identifier);

    if (!limitCheck.allowed) {
      const error = new Error(limitCheck.message);
      error.code = 'RATE_LIMIT_EXCEEDED';
      error.retryAfter = limitCheck.retryAfter;
      throw error;
    }

    return await fn(...args);
  };
};

export default rateLimiter;
