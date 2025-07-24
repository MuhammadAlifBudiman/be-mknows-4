/**
 * Interface representing a user session entity.
 * - pk: Primary key for the session
 * - uuid: Unique identifier for the session
 * - user_id: Associated user's primary key
 * - useragent: User agent string
 * - ip_address: IP address of the user
 * - status: Session status (e.g., active, expired)
 * - is_current: Optional flag indicating if this is the current session
 * - user: Optional User object for session owner
 */

import { User } from "@interfaces/user.interface";

export interface UserSession {
  pk: number;           // Primary key
  uuid: string;         // Unique identifier
  user_id: number;      // Associated user's primary key
  useragent: string;    // User agent string
  ip_address: string;   // User's IP address
  status: string;       // Session status
  is_current?: boolean; // Optional: is this the current session?
  user?: User;          // Optional: User object for session owner
}