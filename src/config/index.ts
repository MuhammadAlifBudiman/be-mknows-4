/**
 * Loads environment variables and exports configuration constants for the application.
 */
import { config } from "dotenv";
// Load environment variables from .env file based on current NODE_ENV
config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

/**
 * Indicates if credentials are required (boolean from env)
 */
export const CREDENTIALS = process.env.CREDENTIALS === "true";

/**
 * Main environment variables for server configuration
 * Includes: NODE_ENV, PORT, SECRET_KEY, LOG_FORMAT, LOG_DIR, ORIGIN
 */
export const { NODE_ENV, PORT, SECRET_KEY, LOG_FORMAT, LOG_DIR, ORIGIN } = process.env;

/**
 * Database connection variables
 * Includes: DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_DATABASE
 */
export const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_DATABASE } = process.env;

/**
 * Rate limiting configuration
 * Includes: RATE_DELAY, RATE_LIMIT
 */
export const { RATE_DELAY, RATE_LIMIT } = process.env; 

/**
 * Maximum file upload size configuration
 */
export const { MAX_SIZE_FILE_UPLOAD } = process.env; 

/**
 * Google email and app password for integrations
 */
export const { GOOGLE_EMAIL, GOOGLE_APP_PASSWORD } = process.env;