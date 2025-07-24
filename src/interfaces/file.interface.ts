/**
 * Interface representing a file entity.
 * - pk: Primary key for the file
 * - uuid: Unique identifier for the file
 * - name: File name
 * - user_id: ID of the user who uploaded the file
 * - type: File type (e.g., image/jpeg)
 * - size: File size in bytes
 * - url: Optional URL to the file (e.g., S3 URL)
 */
export interface File {
  pk: number;        // Primary key
  uuid: string;      // Unique identifier
  name: string;      // File name
  user_id: number;   // Uploader's user ID
  type: string;      // File type
  size: number;      // File size in bytes
  url?: string;      // Optional file URL (e.g., S3)
}