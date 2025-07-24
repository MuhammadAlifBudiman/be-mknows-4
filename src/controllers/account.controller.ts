import { Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { Container } from "typedi";

import { User } from "@interfaces/user.interface";
import { UserSession } from "@interfaces/user-session.interface";
import { RequestWithUser } from "@interfaces/authentication/token.interface";
import { UpdateUserProfileDto } from "@dtos/account.dto";

import { AccountService } from "@services/account.service";
import { apiResponse } from "@utils/apiResponse";

/**
 * AccountController handles user account-related operations.
 * Uses AccountService for business logic and apiResponse for standardized responses.
 */
export class AccountController {
  /**
   * AccountService instance for user operations
   */
  private account = Container.get(AccountService);

  /**
   * Get the profile of the authenticated user
   * @param req - Express request with user info
   * @param res - Express response
   * @param next - Express next middleware
   */
  public getMyProfile = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const user_id = req.user.pk as number; // Extract user ID from request
    const user: User = await this.account.getProfileByUserId(user_id); // Fetch user profile

    res.status(200).json(apiResponse(200, "OK", "Get Profile Success", user)); // Respond with profile
  });

  /**
   * Get session histories for the authenticated user
   * @param req - Express request with user and session info
   * @param res - Express response
   * @param next - Express next middleware
   */
  public getMySessionsHistories = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const user_id = req.user.pk as number; // Extract user ID
    const session_id = req.session_id; // Extract session ID
    const userSessions: UserSession[] = await this.account.getSessionsHistoriesByUserId(user_id, session_id); // Fetch session histories

    res.status(200).json(apiResponse(200, "OK", "Get Sessions Histories Success", userSessions)); // Respond with session histories
  });

  /**
   * Update the profile of the authenticated user
   * @param req - Express request with user info and update data
   * @param res - Express response
   * @param next - Express next middleware
   */
  public updateMyProfile = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const user_id = req.user.pk as number; // Extract user ID
    const updatedProfile: UpdateUserProfileDto = req.body; // Get update data from request body

    const user: User = await this.account.updateUserProfile(user_id, updatedProfile); // Update user profile

    res.status(200).json(apiResponse(200, "OK", "Update Profile Success", user)); // Respond with updated profile
  });
}