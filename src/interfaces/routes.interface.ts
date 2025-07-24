/**
 * Interface for defining route modules in the application.
 * - path: Optional base path for the route
 * - router: Express Router instance handling the route
 */
import { Router } from "express";

export interface Routes {
  path?: string;   // Optional base path for the route
  router: Router;  // Express Router instance
}