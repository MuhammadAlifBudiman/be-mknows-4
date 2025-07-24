/**
 * Data Transfer Object for updating a user's profile.
 * Uses class-validator decorators to enforce validation rules.
 */
import { 
  IsOptional, IsString, IsUUID, MaxLength, MinLength, 
} from "class-validator";

/**
 * DTO for updating user profile information.
 * - full_name: Optional string, min 3 and max 124 characters.
 * - display_picture: Optional UUID string, max 36 characters.
 */
export class UpdateUserProfileDto {
  /**
   * User's full name (optional, 3-124 characters)
   */
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(124)
  public full_name: string;

  /**
   * UUID of user's display picture (optional, max 36 characters)
   */
  @IsUUID()
  @IsOptional()
  @MaxLength(36)
  public display_picture: string;
}