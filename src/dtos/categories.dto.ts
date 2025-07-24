/**
 * Data Transfer Objects for creating and updating categories.
 * Uses class-validator decorators to enforce validation rules for each property.
 */
import { IsString, IsNotEmpty, MinLength, IsOptional } from "class-validator";

/**
 * DTO for creating a new category.
 * - name: Required string.
 * - description: Required string, min 4 characters.
 */
export class CreateCategoryDto {
  /** Category name (required) */
  @IsString()
  @IsNotEmpty()
  public name: string;

  /** Category description (required, min 4 characters) */
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  public description: string;
}

/**
 * DTO for updating a category.
 * All fields are optional, but must meet validation if provided.
 */
export class UpdateCategoryDto {
  /** Category name (optional) */
  @IsString()
  @IsOptional()
  public name: string;

  /** Category description (optional, min 4 characters) */
  @IsString()
  @MinLength(4)
  @IsOptional()
  public description: string;
}