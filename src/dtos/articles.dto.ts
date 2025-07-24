/**
 * Data Transfer Objects for creating and updating articles.
 * Uses class-validator decorators to enforce validation rules for each property.
 */
import { IsString, IsNotEmpty, MinLength, IsOptional, IsArray, IsUUID } from "class-validator";

/**
 * DTO for creating a new article.
 * - title: Required string.
 * - description: Required string, min 4 characters.
 * - content: Required string, min 4 characters.
 * - thumbnail: Required string or number, min 36 characters.
 * - categories: Required array of UUID v4 strings.
 */
export class CreateArticleDto {
  /** Article title (required) */
  @IsString()
  @IsNotEmpty()
  public title: string;

  /** Article description (required, min 4 characters) */
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  public description: string;

  /** Article content (required, min 4 characters) */
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  public content: string;

  /** Article thumbnail (required, min 36 characters) */
  @IsString()
  @IsNotEmpty()
  @MinLength(36)
  public thumbnail: string | number;

  /** Article categories (required, array of UUID v4) */
  @IsArray()
  @IsUUID("4", { each: true })
  @IsNotEmpty()
  public categories: string[];
}

/**
 * DTO for updating an article.
 * All fields are optional, but must meet validation if provided.
 */
export class UpdateArticleDto {
  /** Article title (optional) */
  @IsString()
  @IsOptional()
  public title: string;

  /** Article description (optional, min 4 characters) */
  @IsString()
  @MinLength(4)
  @IsOptional()
  public description: string;

  /** Article content (optional, min 4 characters) */
  @IsString()
  @MinLength(4)
  @IsOptional()
  public content: string;

  /** Article thumbnail (optional, min 36 characters) */
  @IsString()
  @MinLength(36)
  @IsOptional()
  public thumbnail: string | number;

  /** Article categories (optional, array of UUID v4) */
  @IsArray()
  @IsUUID("4", { each: true })
  @IsOptional()
  public categories: string[];
}