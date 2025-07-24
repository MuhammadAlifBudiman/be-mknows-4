/**
 * Sequelize CLI configuration for database migrations and seeders
 * Loads environment variables for database connection
 */
const { config } = require('dotenv'); // Import dotenv for env variable loading
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` }); // Load env file based on NODE_ENV

// Destructure database connection variables from environment
const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;

module.exports = {
  username: DB_USER, // Database username
  password: DB_PASSWORD, // Database password
  database: DB_DATABASE, // Database name
  port: DB_PORT, // Database port
  host: DB_HOST, // Database host
  dialect: 'postgres', // Database dialect
  migrationStorageTableName: 'sequelize_migrations', // Table for migration history
  seederStorageTableName: 'sequelize_seeds', // Table for seeder history
  ssl: true, // Enable SSL connection
  dialectOptions: {
    ssl: {
      require: true, // Require SSL
      rejectUnauthorized: false, // Allow self-signed certificates
    },
  },
};