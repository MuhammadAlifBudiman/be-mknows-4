/**
 * Route definition for authentication-related endpoints.
 * Uses AuthController for business logic and applies authentication and validation middleware.
 */
import { Router } from "express"; // Express router
import { Routes } from "@interfaces/routes.interface"; // Route interface

import { AuthController } from "@controllers/auth.controller"; // Controller for authentication operations
import { AuthMiddleware } from "@middlewares/auth.middleware"; // Middleware for authentication
import { ValidationMiddleware } from "@middlewares/validation.middleware"; // Middleware for request validation
import { CreateUserDto, LoginUserDto } from "@dtos/users.dto"; // DTOs for user registration and login

/**
 * AuthRoute class implements authentication-related routes.
 * - path: Base path for auth routes
 * - router: Express router instance
 * - auth: AuthController instance
 */
export class AuthRoute implements Routes {
  public path = "auth";
  public router = Router();
  public auth = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  /**
   * Initializes authentication routes and applies middleware.
   * - POST /register: Register a new user (validation required)
   * - POST /login: Log in a user (validation required)
   * - POST /logout: Log out the authenticated user
   * - POST /verify: Verify user email
   * - POST /:uuid/assign-role: Assign a role to a user (development/testing only)
   */
  private initializeRoutes() {
    this.router.post(`/v1/${this.path}/register`, ValidationMiddleware(CreateUserDto), this.auth.signUp);
    this.router.post(`/v1/${this.path}/login`, ValidationMiddleware(LoginUserDto), this.auth.logIn);
    this.router.post(`/v1/${this.path}/logout`, AuthMiddleware, this.auth.logOut);

    this.router.post(`/v1/${this.path}/verify`, this.auth.verifyEmail);

    // Assign role endpoint (development/testing only)
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      this.router.post(`/v1/${this.path}/:uuid/assign-role`, this.auth.assignRoleToUser);
    }
  }
}