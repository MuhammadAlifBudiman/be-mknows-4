/**
 * Database configuration for Sequelize ORM
 * Reads environment variables for connection details
 */
const { NODE_ENV, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;

module.exports = {
  /**
   * Development environment configuration
   * Uses PostgreSQL with SSL enabled
   */
  development: {
    dialect: "postgres", // Database dialect
    host: DB_HOST,       // Hostname from env
    username: DB_USER,   // Username from env
    password: DB_PASSWORD, // Password from env
    database: DB_DATABASE, // Database name from env
    port: DB_PORT,       // Port from env
    define: {
      underscored: true,      // Use snake_case for columns
      freezeTableName: true,  // Prevent pluralizing table names
      paranoid: true,         // Enable soft deletes
      createdAt: "created_at", // Custom createdAt column name
      updatedAt: "updated_at", // Custom updatedAt column name
      deletedAt: "deleted_at", // Custom deletedAt column name
    },
    pool: {
      min: 0, // Minimum connections in pool
      max: 5, // Maximum connections in pool
    },
    logQueryParameters: NODE_ENV === "development", // Log query params in dev
    logging: false,    // Disable SQL query logging
    benchmark: false,  // Disable query benchmarking
    ssl: true,         // Enable SSL connection
    dialectOptions: {
      ssl: {
        require: true,             // Require SSL
        rejectUnauthorized: false, // Allow self-signed certs
      },
      sslmode: "require",         // Enforce SSL mode
    },
  },
  /**
   * Production environment configuration
   * Similar to development, but logging is always disabled
   */
  production: {
    dialect: "postgres",
    host: DB_HOST,
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    port: DB_PORT,
    define: {
      underscored: true,
      freezeTableName: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    },
    logging: false,
    benchmark: false,
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
      sslmode: "require",
    },
  }
}