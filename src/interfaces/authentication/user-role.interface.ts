/**
 * Interfaces for user roles and their association with users.
 */
export interface Role {
  pk: number;      // Primary key for the role
  uuid: string;    // Unique identifier for the role
  name: string;    // Name of the role
}

/**
 * Interface representing the relationship between a user and a role.
 * - role: Optional Role object
 * - user_id: User's primary key
 * - role_id: Role's primary key
 */
export interface UserRole {
  role?: Role;     // Optional role object
  user_id: number; // User's primary key
  role_id: number; // Role's primary key
}