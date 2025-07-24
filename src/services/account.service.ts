// Import Service decorator from typedi for dependency injection
import { Service } from "typedi";
// Import function to get database instance lazily
import { getDB } from "@/database/db-lazy";
// Import User interface for user data structure
import { User } from "@interfaces/user.interface";
// Import UserSession interface for session data structure
import { UserSession } from "@interfaces/user-session.interface";
// Import UserModel for ORM operations on users table
import { UserModel } from "@models/users.model";
// Import UserSessionModel for ORM operations on user sessions table
import { UserSessionModel } from "@models/users_sessions.model";
// Import DTO for updating user profile
import { UpdateUserProfileDto } from "@dtos/account.dto";
// Import custom HTTP exception for error handling
import { HttpException } from "@/exceptions/HttpException";

/**
 * Service class for account-related operations.
 * Handles user profile retrieval, session history, and profile updates.
 */
@Service()
export class AccountService {
  /**
   * Retrieves a user's profile by their user ID.
   * @param user_id - The primary key of the user.
   * @returns Promise<User> - The user's profile data.
   * @throws HttpException if user is not found.
   */
  public async getProfileByUserId(user_id: number): Promise<User> {
    const DB = await getDB();

    // Find user by primary key, exclude 'pk' from attributes
    const user: UserModel = await DB.Users.findOne({ 
      attributes: { exclude: ["pk"] },
      where: { pk: user_id }
    });

    if (!user) {
      throw new HttpException(false, 404, "User not found");
    }

    // If user has a display picture, get its UUID
    let displayPictureUuid: string | null = null;
    if (user.display_picture) {
      const file = await DB.Files.findOne({ where: { pk: user.display_picture }});
      displayPictureUuid = file?.uuid || null;
    }

    // Build response object with user data and display picture UUID
    const response = {
      ...user.get(),
      display_picture: displayPictureUuid,
    };

    return response;
  }

  /**
   * Retrieves session histories for a user by user ID.
   * @param user_id - The user's primary key.
   * @param session_id - The current session's UUID.
   * @returns Promise<UserSession[]> - Array of user session objects.
   */
  public async getSessionsHistoriesByUserId(user_id: number, session_id: string): Promise<UserSession[]> {
    const DB = await getDB();
    // Find all sessions for the user, exclude 'pk' and 'user_id'
    const userSessions: UserSessionModel[] = await DB.UsersSessions.findAll({
      attributes: { exclude: ["pk", "user_id"] },
      where: { user_id }
    });

    // Mark the current session and parse session objects
    const userSessionsParsed = userSessions.map(session => ({
      ...session.get(),
      is_current: session.uuid === session_id
    }));

    // Sort so current session appears first
    userSessionsParsed.sort((a, b) => (b.is_current ? 1 : 0) - (a.is_current ? 1 : 0));
    return userSessionsParsed;
  }

  /**
   * Updates a user's profile with provided data.
   * @param user_id - The user's primary key.
   * @param data - DTO containing profile update fields.
   * @returns Promise<User> - The updated user profile.
   * @throws HttpException if file is not found or no fields are provided.
   */
  public async updateUserProfile(user_id: number, data: UpdateUserProfileDto): Promise<User> {
    const DB = await getDB();
    const updatedData: any = {};
  
    // Update full name if provided
    if (data.full_name) updatedData.full_name = data.full_name;
  
    // Update display picture if provided
    if (data.display_picture) {
      const file = await DB.Files.findOne({ attributes: ["pk"], where: { uuid: data.display_picture, user_id } });
  
      if (!file) {
        throw new HttpException(false, 400, "File is not found");
      }
  
      updatedData.display_picture = file.pk;
    }
  
    // Throw error if no fields are provided
    if (Object.keys(updatedData).length === 0) {
      throw new HttpException(false, 400, "Some field is required");
    }
  
    // Update user and return updated user object
    const [_, [user]] = await DB.Users.update(updatedData, {
      where: { pk: user_id },
      returning: true,
    });

    // Remove sensitive fields from user object
    delete user.dataValues.pk;
    delete user.dataValues.password;

    // Get display picture UUID if available
    let displayPictureUuid: string | null = null;
    if (user.display_picture) {
      const file = await DB.Files.findOne({ where: { pk: user.display_picture }});
      displayPictureUuid = file?.uuid || null;
    }
    
    // Build response object with updated user data and display picture UUID
    const response = {
      ...user.get(),
      display_picture: displayPictureUuid,
    };

    return response;
  }
}