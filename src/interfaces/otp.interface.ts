/**
 * Interfaces for OTP (One-Time Password) entities and OTP creation.
 * Used to define the structure of OTP data and related operations in the application.
 */
export interface OTP {
  pk: number;         // Primary key for the OTP
  uuid: string;       // Unique identifier for the OTP
  user_id: number;    // Associated user's primary key
  key: string;        // OTP key value
  type: string;       // OTP type (e.g., email, sms)
  status: string;     // OTP status (e.g., active, expired)
  expired_at?: Date;  // Optional expiration date/time
}

/**
 * Interface for creating a new OTP.
 * - user_id: Associated user's primary key
 */
export interface createOTP {
  user_id: number;    // Associated user's primary key
}