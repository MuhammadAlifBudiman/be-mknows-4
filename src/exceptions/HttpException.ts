/**
 * Custom HTTP exception classes for error handling in API responses.
 * Extends the built-in Error class to include status, success, and error details.
 */
export class HttpException extends Error {
  /** Indicates if the request was successful (always false for errors) */
  public success: boolean;
  /** HTTP status code for the error */
  public status: number;
  /** Error message */
  public message: string;
  /** Optional array of error details */
  public errors?: string[];

  /**
   * Constructs a new HttpException
   * @param success - Indicates success (false for errors)
   * @param status - HTTP status code
   * @param message - Error message
   * @param errors - Optional array of error details
   */
  constructor(success: boolean, status: number, message: string, errors?: string[]) {
    super(message);
    this.success = success;
    this.status = status;
    this.message = message;
    this.errors = errors;
  }
}

/**
 * Specialized exception for rate limiting (HTTP 429 Too Many Requests)
 */
export class HttpExceptionTooManyRequests extends HttpException {
  /**
   * Constructs a new TooManyRequests exception
   * @param errors - Array of error details
   */
  constructor(errors: string[]) {
    super(false, 429, "TOO_MANY_REQUEST", errors);
  }
}