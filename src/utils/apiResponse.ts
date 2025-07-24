// Import Pagination interface for pagination metadata
import { Pagination } from "@interfaces/common/pagination.interface";
// Import ApiResponse interface for response structure
import { ApiResponse } from "@interfaces/common/api-response.interface";

/**
 * Returns a custom API response object.
 *
 * @template T - Extends Pagination for meta information.
 * @param {number} code - HTTP status code of the response.
 * @param {string} responseStatus - Status string (e.g., 'success', 'error').
 * @param {string} message - Message describing the response.
 * @param {unknown} [data] - Optional response data payload.
 * @param {T} [meta] - Optional pagination or meta information.
 * @returns {ApiResponse} - The formatted API response object.
 */
export function apiResponse<T extends Pagination>(
  code: number,
  responseStatus: string,
  message: string,
  data?: unknown,
  meta?: T,
): ApiResponse {
  return {
    code,
    status: responseStatus,
    message,
    data: data || {},
    meta,
  };
}