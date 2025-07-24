/**
 * Interface for standardized API responses.
 * - code: HTTP status code
 * - status: Status string (e.g., 'OK', 'BAD REQUEST')
 * - message: Response message
 * - data: Optional response data (object or unknown)
 * - errors: Optional array of error details
 * - meta: Optional pagination metadata
 */
import { Pagination } from "@interfaces/common/pagination.interface";

export interface ApiResponse {
  code: number;           // HTTP status code
  status: string;         // Status string
  message: string;        // Response message
  data?: undefined | object | unknown; // Optional response data
  errors?: unknown[];     // Optional error details
  meta?: Pagination;      // Optional pagination metadata
}