/**
 * AuthController handles authentication and user management operations.
 * Provides endpoints for user registration, login, logout, email verification, and role assignment.
 */
import { NextFunction, Request, Response } from "express"; // Express types for request handling
import { Container } from "typedi"; // Dependency injection container
import asyncHandler from "express-async-handler"; // Async error handler middleware

import { AuthService } from "@services/auth.service"; // Service for authentication logic

import { User, UserResponse } from "@interfaces/user.interface"; // User interfaces
import { RequestWithUser } from "@interfaces/authentication/token.interface"; // Authenticated request interface
import { UserAgent } from "@interfaces/common/useragent.interface"; // User agent interface

import { CreateUserDto } from "@dtos/users.dto"; // DTO for user creation

import { getUserAgent } from "@utils/userAgent"; // Utility to parse user agent
import { apiResponse } from "@utils/apiResponse"; // Standardized API response
import { HttpException } from "@exceptions/HttpException"; // Custom HTTP exception

/**
 * Main controller class for authentication endpoints
 */
export class AuthController {
  /**
   * AuthService instance for authentication operations
   */
  private auth = Container.get(AuthService);

  /**
   * Register a new user
   * @param req - Express request containing user registration data
   * @param res - Express response
   * @param next - Express next middleware
   */
  public signUp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userData: CreateUserDto = req.body;
    const signUpUserData: UserResponse = await this.auth.signup(userData);

    res.status(201).json(apiResponse(201, "OK", "Register Success", signUpUserData));
  });

  /**
   * Log in a user and set authentication cookie
   * @param req - Express request containing login data
   * @param res - Express response
   * @param next - Express next middleware
   */
  public logIn = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userAgentPayload: UserAgent = getUserAgent(req);
    const userData: CreateUserDto = req.body;
    
    const { cookie, accessToken } = await this.auth.login(userData, userAgentPayload);

    res.setHeader("Set-Cookie", [cookie]);
    res.status(200).json(apiResponse(200, "OK", "Login Success", { access_token: accessToken }));
  });

  /**
   * Log out the authenticated user and clear authentication cookie
   * @param req - Express request with user and session info
   * @param res - Express response
   * @param next - Express next middleware
   */
  public logOut = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const userData: User = req.user;
    const userSessionId: string = req.session_id;

    await this.auth.logout(userData, userSessionId);

    res.setHeader("Set-Cookie", ["Authorization=; Max-age=0"]);
    res.status(200).json(apiResponse(200, "OK", "Logout Success", {}));
  });

  /**
   * Verify user's email using UUID and OTP
   * @param req - Express request containing uuid and otp
   * @param res - Express response
   * @param next - Express next middleware
   */
  public verifyEmail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { uuid, otp } = req.body;
    if(!uuid || !otp) throw new HttpException(false, 400, "UUID and OTP is required");

    const response = await this.auth.verifyEmail(uuid, otp);
    res.status(200).json(apiResponse(200, "OK", "Email has been verified", {
      email: response.email
    }));
  });

  /**
   * Assign a role to a user by UUID
   * @param req - Express request containing user UUID and role
   * @param res - Express response
   * @param next - Express next middleware
   */
  public assignRoleToUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user_uuid = req.params.uuid;
    const { role } = req.body; 
    if (!role) {
      throw new HttpException(false, 400, "Role is required");
    }
    const result = await this.auth.assignRoleToUser(user_uuid, role);
    res.status(200).json(apiResponse(200, "OK", `Role '${role}' has been assigned to user`, result));
  });
}