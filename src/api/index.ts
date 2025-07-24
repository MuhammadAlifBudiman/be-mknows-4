// index.ts - Entry point for API server
// Import the Express app instance from the server module
import { app } from '../server';
// Import PostgreSQL driver (side effect only, for DB connection pooling)
import "pg";

// Start the Express server by listening on the configured port
app.listen();
