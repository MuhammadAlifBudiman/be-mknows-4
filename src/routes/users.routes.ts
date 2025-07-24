// Import Express Router for route definitions
import { Router } from "express";
// Import the Routes interface for consistent route structure
import { Routes } from "@interfaces/routes.interface";
// Import the UserController to handle user-related logic
import { UserController } from "@controllers/user.controller";
// Import authentication middleware and role-based authorization for user routes
import { AuthMiddleware, AuthorizedRoles } from "@middlewares/auth.middleware";
// Import rate limiter middleware to control request rate
import Limitter from "@middlewares/rate-limitter.middleware";
// import { ValidationMiddleware } from "@middlewares/validation.middleware"; // (Commented: for future validation)
// import { CreateUserDto } from "@dtos/users.dto"; // (Commented: for future user creation validation)

/**
 * Route definition class for user-related endpoints.
 * Implements the Routes interface to provide path, router, and controller.
 */
export class UserRoute implements Routes {
  /**
   * The base path for user routes.
   * @type {string}
   */
  public path = "users";
  /**
   * Express router instance for user routes.
   * @type {Router}
   */
  public router = Router();
  /**
   * Controller instance to handle user logic.
   * @type {UserController}
   */
  public user = new UserController();
  /**
   * Rate limiter instance for user routes.
   * @type {Limitter}
   */
  public limitter = new Limitter();

  /**
   * Initializes the user route and sets up endpoints.
   */
  constructor() {
    this.initializeRoutes();
  }

  /**
   * Defines all user-related endpoints and their middlewares.
   *
   * - GET /v1/users/check: Get user agent information
   * - GET /v1/users: Get all users (rate limited, admin only)
   * - GET /v1/users/:uuid: Get user by UUID
   */
  private initializeRoutes() {
    // Route for checking user agent information
    this.router.get(`/v1/users/check`, this.user.getUseragent);
    // Route for retrieving all users (rate limited, requires admin role)
    this.router.get(`/v1/${this.path}`, 
      this.limitter.default(), 
      AuthMiddleware, AuthorizedRoles(["ADMIN"]), 
      this.user.getUsers
    );
    // Route for retrieving a user by UUID
    this.router.get(`/v1/${this.path}/:uuid`, this.user.getUserByUUID);
  }
}