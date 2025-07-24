/**
 * Interfaces for JWT token data, payload, and Express request extension for authentication.
 */
import { Request } from "express"; // Express request type
import { User } from "@interfaces/user.interface"; // User interface

/**
 * Data stored in JWT token.
 * - sid: Optional session UUID
 * - uid: User UUID
 * - iat: Optional issued at timestamp
 * - exp: Optional expiration timestamp
 */
export interface DataStoredInToken {
  sid?: string; // user session uuid 
  uid: string; // user uuid

  iat?: number; // issued at
  exp?: number; // expiration
}

/**
 * JWT token payload structure.
 * - token: JWT string
 * - expiresIn: Expiration time in seconds
 */
export interface TokenPayload {
  token: string;
  expiresIn: number;
}

/**
 * Express request extended with authentication properties.
 * - session_id: Session UUID
 * - user: Authenticated user object
 * - user_roles: Array of user roles
 */
export interface RequestWithUser extends Request {
  session_id: string;
  user: User;
  user_roles: string[];
}