/**
 * Data Transfer Objects for creating and updating replies to comments.
 * Uses class-validator decorators to enforce validation rules for each property.
 */
import { IsString, IsNotEmpty, IsOptional } from "class-validator";

/**
 * DTO for creating a new reply.
 * - reply: Required string.
 */
export class CreateReplyDto{
    /** Reply text (required) */
    @IsString()
    @IsNotEmpty()
    public reply: string;
}

/**
 * DTO for updating a reply.
 * - reply: Optional string.
 */
export class UpdateReplyDto{
    /** Reply text (optional) */
    @IsString()
    @IsOptional()
    public reply: string;
}