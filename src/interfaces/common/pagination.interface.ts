/**
 * Interface for pagination metadata in API responses.
 * - current_page: Current page number
 * - size_page: Number of items per page
 * - max_page: Maximum number of pages
 * - total_data: Total number of items
 */
export interface Pagination {
  current_page: number;   // Current page number
  size_page: number;      // Number of items per page
  max_page: number;       // Maximum number of pages
  total_data: number;     // Total number of items
}