/**
 * Interface representing a category entity.
 * - pk: Primary key for the category
 * - uuid: Unique identifier for the category
 * - name: Name of the category
 * - description: Description of the category
 */
export interface Category {
  pk: number;        // Primary key
  uuid: string;      // Unique identifier
  name: string;      // Category name
  description: string; // Category description
}