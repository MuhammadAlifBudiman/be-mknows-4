/**
 * CategoryController handles CRUD operations for categories.
 * Uses CategoryService for business logic and apiResponse for standardized responses.
 */
import { Response, NextFunction } from "express"; // Express types for request handling
import asyncHandler from "express-async-handler"; // Async error handler middleware
import { Container } from "typedi"; // Dependency injection container

import { RequestWithUser } from "@interfaces/authentication/token.interface"; // Authenticated request interface

import { CategoryService } from "@services/categories.service"; // Service for category logic
import { Category } from "@interfaces/category.interface"; // Category interface

import { CreateCategoryDto, UpdateCategoryDto } from "@dtos/categories.dto"; // DTOs for category creation and update
import { apiResponse } from "@utils/apiResponse"; // Standardized API response

/**
 * Main controller class for category endpoints
 */
export class CategoryController {
  /**
   * CategoryService instance for category operations
   */
  private category = Container.get(CategoryService);

  /**
   * Get all categories
   * @param req - Express request
   * @param res - Express response
   * @param next - Express next middleware
   */
  public getCategories = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const response: Category[] = await this.category.getCategories();
    res.status(200).json(apiResponse(200, "OK", "Get Category Success", response));
  });

  /**
   * Create a new category
   * @param req - Express request containing category data
   * @param res - Express response
   * @param next - Express next middleware
   */
  public createCategory = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const data: CreateCategoryDto = req.body;
    const response: Category = await this.category.createCategory(data);
    res.status(201).json(apiResponse(201, "OK", "Create Category Success", response));
  });

  /**
   * Update an existing category by ID
   * @param req - Express request containing category ID and update data
   * @param res - Express response
   * @param next - Express next middleware
   */
  public updateCategory = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { category_id } = req.params;
    const data: UpdateCategoryDto = req.body;
    const response: Category = await this.category.updateCategory(category_id, data);
    res.status(200).json(apiResponse(200, "OK", "Update Category Success", response));
  });

  /**
   * Delete a category by ID
   * @param req - Express request containing category ID
   * @param res - Express response
   * @param next - Express next middleware
   */
  public deleteCategory = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { category_id } = req.params;
    await this.category.deleteCategory(category_id);
    res.status(200).json(apiResponse(200, "OK", "Delete Category Success", {}));
  });
}