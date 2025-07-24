/**
 * UserController handles user-related operations such as retrieving user data and user agent information.
 * Uses UserService for business logic and apiResponse for standardized responses.
 */
import { NextFunction, Request, Response } from "express"; // Express types for request handling
import { Container } from "typedi"; // Dependency injection container
import asyncHandler from "express-async-handler"; // Async error handler middleware

import { User } from "@interfaces/user.interface"; // User interface
import { UserService } from "@services/users.service"; // Service for user logic
import { apiResponse } from "@/utils/apiResponse"; // Standardized API response
import { getUserAgent } from "@utils/userAgent"; // Utility to parse user agent
import { UserAgent } from "@interfaces/common/useragent.interface"; // User agent interface
// import { CreateUserDto } from "@dtos/users.dto";

/**
 * Main controller class for user endpoints
 */
export class UserController {
  /**
   * UserService instance for user operations
   */
  public user = Container.get(UserService);

  /**
   * Get user agent information from the request
   * @param req - Express request
   * @param res - Express response
   * @param next - Express next middleware
   */
  public getUseragent = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userAgentPayload: UserAgent = getUserAgent(req);
    res.status(200).json(apiResponse(200, "OK", "User Agent Retrieved", userAgentPayload));
  });

  /**
   * Get all users
   * @param req - Express request
   * @param res - Express response
   * @param next - Express next middleware
   */
  public getUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const findAllUsersData: User[] = await this.user.findAllUser();

    res.status(200).json(apiResponse(200, "OK", "All Users Retrieved", findAllUsersData));
  });

  /**
   * Get a user by UUID
   * @param req - Express request containing user UUID
   * @param res - Express response
   * @param next - Express next middleware
   */
  public getUserByUUID = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user_uuid = req.params.uuid;
    const findOneUserData: User = await this.user.findUserByUUID(user_uuid);

    res.status(200).json(apiResponse(200, "OK", "User Retrieved", findOneUserData));
  });


}