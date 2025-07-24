/**
 * Interface for user agent metadata extracted from requests.
 * - browser: Name of the browser
 * - version: Browser version
 * - os: Operating system
 * - platform: Device platform
 * - ip_address: User's IP address
 * - referrer: Referrer URL
 * - source: Raw user agent string
 */
export interface UserAgent {
  browser: string;      // Browser name
  version: string;      // Browser version
  os: string;           // Operating system
  platform: string;     // Device platform
  ip_address: string;   // User's IP address
  referrer: string;     // Referrer URL
  source: string;       // Raw user agent string
}