/**
 * Data Transfer Objects for user creation, login, and update.
 * Uses class-validator decorators to enforce validation rules for each property.
 */
import { IsString, IsEmail, IsNotEmpty, MinLength, MaxLength } from "class-validator";

/**
 * DTO for creating a new user.
 * - email: Required, must be a valid email address.
 * - password: Required string, 4-32 characters.
 * - full_name: Required string.
 */
export class CreateUserDto {
  /** User email (required, must be valid email) */
  @IsEmail()
  public email: string;

  /** User password (required, 4-32 characters) */
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(32)
  public password: string;
  
  /** User full name (required) */
  @IsString()
  @IsNotEmpty()
  public full_name: string;
}

/**
 * DTO for user login.
 * - email: Required, must be a valid email address.
 * - password: Required string, 4-32 characters.
 */
export class LoginUserDto {
  /** User email (required, must be valid email) */
  @IsEmail()
  public email: string;

  /** User password (required, 4-32 characters) */
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(32)
  public password: string;
}

/**
 * DTO for updating user password.
 * - password: Required string, 9-32 characters.
 */
export class UpdateUserDto {
  /** User password (required, 9-32 characters) */
  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(32)
  public password: string;
}