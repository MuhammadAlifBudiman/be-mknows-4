/**
 * Route definition for category-related endpoints.
 * Uses CategoryController for business logic and applies authentication and validation middleware.
 */
import { Router } from "express"; // Express router
import { Routes } from "@interfaces/routes.interface"; // Route interface

import { AuthMiddleware } from "@middlewares/auth.middleware"; // Middleware for authentication
import { ValidationMiddleware } from "@middlewares/validation.middleware"; // Middleware for request validation
import { CategoryController } from '@/controllers/category.controller'; // Controller for category operations
import { CreateCategoryDto, UpdateCategoryDto } from '@/dtos/categories.dto'; // DTOs for category validation

/**
 * CategoryRoute class implements category-related routes.
 * - path: Base path for category routes
 * - router: Express router instance
 * - controller: CategoryController instance
 */
export class CategoryRoute implements Routes {
  public path = "categories";
  public router = Router();
  public controller = new CategoryController();

  constructor() {
    this.initializeRoutes();
  }

  /**
   * Initializes category routes and applies middleware.
   * - GET /: Get all categories
   * - POST /: Create a new category (auth & validation required)
   * - PUT /:category_id: Update a category (auth & validation required)
   * - DELETE /:category_id: Delete a category (auth required)
   */
  private initializeRoutes() {
    this.router.get(`/v1/${this.path}`, this.controller.getCategories);
    this.router.post(`/v1/${this.path}`, 
      AuthMiddleware, ValidationMiddleware(CreateCategoryDto), 
      this.controller.createCategory
    );
    this.router.put(
      `/v1/${this.path}/:category_id`, 
      AuthMiddleware, ValidationMiddleware(UpdateCategoryDto), 
      this.controller.updateCategory
    );
    this.router.delete(
      `/v1/${this.path}/:category_id`,
      AuthMiddleware,
      this.controller.deleteCategory
    )
  }
}