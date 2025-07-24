/**
 * Interfaces for user entities and user response objects.
 * Used to define the structure of user data in the application.
 */
import { File } from "@interfaces/file.interface";

/**
 * Main user entity interface.
 * - pk: Optional primary key
 * - uuid: Optional unique identifier
 * - full_name: Optional user's full name
 * - display_picture: Optional display picture (number or string)
 * - email: User's email address
 * - password: Optional password
 * - email_verified_at: Optional date of email verification
 * - avatar: Optional File object for user's avatar
 */
export interface User {
  pk?: number;                 // Optional primary key
  uuid?: string;               // Optional unique identifier
  full_name?: string;          // Optional user's full name
  display_picture?: number | string; // Optional display picture
  email: string;               // User's email address
  password?: string;           // Optional password
  email_verified_at?: Date;    // Optional email verification date
  avatar?: File;               // Optional avatar file
}

/**
 * User response object omitting password for security.
 */
export interface UserResponse extends Omit<User, "password"> {}