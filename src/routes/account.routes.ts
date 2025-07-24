/**
 * Route definition for account-related endpoints.
 * Uses AccountController for business logic and applies authentication and validation middleware.
 */
import { Router } from "express"; // Express router
import { Routes } from "@interfaces/routes.interface"; // Route interface

import { AccountController } from "@controllers/account.controller"; // Controller for account operations
import { AuthMiddleware } from "@middlewares/auth.middleware"; // Middleware for authentication
import { ValidationMiddleware } from "@middlewares/validation.middleware"; // Middleware for request validation
import { UpdateUserProfileDto } from "@dtos/account.dto"; // DTO for profile update validation

/**
 * AccountRoute class implements account-related routes.
 * - path: Base path for account routes
 * - router: Express router instance
 * - account: AccountController instance
 */
export class AccountRoute implements Routes {
  public path = "account";
  public router = Router();
  public account = new AccountController();

  constructor() {
    this.initializeRoutes();
  }

  /**
   * Initializes account routes and applies middleware.
   * - GET /profile/me: Get current user's profile
   * - GET /sessions/me: Get current user's session histories
   * - PUT /profile/me: Update current user's profile (with validation)
   */
  private initializeRoutes() {
    this.router.get(`/v1/${this.path}/profile/me`, AuthMiddleware, this.account.getMyProfile);
    this.router.get(`/v1/${this.path}/sessions/me`, AuthMiddleware, this.account.getMySessionsHistories);
    this.router.put(`/v1/${this.path}/profile/me`, AuthMiddleware, ValidationMiddleware(UpdateUserProfileDto), this.account.updateMyProfile);
  }
}