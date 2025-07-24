/**
 * Data Transfer Objects for creating and updating comments.
 * Uses class-validator decorators to enforce validation rules for each property.
 */
import { IsString, IsNotEmpty, MinLength, IsOptional, IsArray, IsUUID } from "class-validator";

/**
 * DTO for creating a new comment.
 * - comment: Required string.
 */
export class CreateCommentDto{
    /** Comment text (required) */
    @IsString()
    @IsNotEmpty()
    public comment: string;
}

/**
 * DTO for updating a comment.
 * - comment: Optional string.
 */
export class UpdateCommentDto{
    /** Comment text (optional) */
    @IsString()
    @IsOptional()
    public comment: string;
}