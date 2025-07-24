// Import bcrypt functions for password hashing and comparison
import { compare, hash } from "bcrypt";
// Import JWT sign function for token creation
import { sign } from "jsonwebtoken";
// Import Service decorator from typedi for dependency injection
import { Service } from "typedi";
// Import Sequelize Transaction type for transactional operations
import { Transaction } from "sequelize";
// Import secret key for JWT signing
import { SECRET_KEY } from "@config/index";
// Import function to get database instance lazily
import { getDB } from "@/database/db-lazy";
// Import OTP service for handling OTP logic
import { OTPService } from "@services/otps.service";
// Import interfaces for user, user role, session, user agent, and token payloads
import { User } from "@interfaces/user.interface";
import { UserRole } from "@interfaces/authentication/user-role.interface";
import { UserSession } from "@interfaces/user-session.interface";
import { UserAgent } from "@interfaces/common/useragent.interface";
import { DataStoredInToken, TokenPayload } from "@interfaces/authentication/token.interface";
// Import DTO for user creation
import { CreateUserDto } from "@dtos/users.dto";
// Import custom HTTP exception for error handling
import { HttpException } from "@exceptions/HttpException";
// Import utility for sending OTP emails
import { sendEmailOTP } from "@utils/mailer";

/**
 * Creates a JWT access token for a user and session.
 * @param user - The user object.
 * @param userSession - The user session object.
 * @returns TokenPayload - The token and its expiration.
 */
const createAccessToken = (user: User, userSession: UserSession): TokenPayload => {
  const dataStoredInToken: DataStoredInToken = { uid: user.uuid, sid: userSession.uuid };
  const expiresIn: number = 60 * 60 * 60;

  return { expiresIn: expiresIn, token: sign(dataStoredInToken, SECRET_KEY, { expiresIn }) };
};  

/**
 * Creates an HTTP-only cookie string for the access token.
 * @param TokenPayload - The token payload object.
 * @returns string - The cookie string.
 */
const createCookie = (TokenPayload: TokenPayload): string => {
  return `Authorization=${TokenPayload.token}; HttpOnly; Max-Age=${TokenPayload.expiresIn};`;
};

/**
 * Service class for authentication-related operations.
 * Handles signup, login, logout, session management, role assignment, and email verification.
 */
@Service()
export class AuthService {
  /**
   * Registers a new user, assigns role, and sends OTP for email verification.
   * @param userData - DTO containing user registration fields.
   * @returns Promise<{ uuid: string, email: string, otp?: string }>
   * @throws HttpException if email already exists or other errors occur.
   */
  public async signup(userData: CreateUserDto): Promise<{ uuid: string, email: string, otp?: string }> {
    const transaction = await (await getDB()).sequelize.transaction();

    try {
      const existingUser = await (await getDB()).Users.findOne({ where: { email: userData.email }, transaction });

      if (existingUser) {
        throw new HttpException(false, 409, `This email ${userData.email} already exists`);
      }
  
      const hashedPassword = await hash(userData.password, 10);
  
      const createUser = await (await getDB()).Users.create(
        { ...userData, password: hashedPassword },
        { transaction }
      );
  
      const roleId = await this.getRoleId("USER");
      await this.asignUserRole(createUser.pk, roleId, transaction);
      
      const validInMinutes = 10;
      const otp = await new OTPService().createOTP({
        user_id: createUser.pk,
        type: "EMAIL_VERIFICATION",
      }, validInMinutes, transaction);
      
      await sendEmailOTP({
        email: createUser.email,
        full_name: createUser.full_name,
        otp: otp.key,
        expiration_time: validInMinutes,
      });

      await transaction.commit();
      
      // Only include OTP key in response in development or test
      if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
        return { uuid: createUser.uuid, email: createUser.email, otp: otp.key };
      }
      return { uuid: createUser.uuid, email: createUser.email };
    } catch (error) {
      await transaction.rollback();
      throw error; 
    }
  }

  /**
   * Authenticates a user and creates a session, returning cookie and access token.
   * @param userData - DTO containing login credentials.
   * @param userAgent - User agent information for session.
   * @returns Promise<{ cookie: string; accessToken: string }>
   * @throws HttpException if user not found, password mismatch, or email not verified.
   */
  public async login(userData: CreateUserDto, userAgent: UserAgent): Promise<{ cookie: string; accessToken: string }> {
    const findUser: User = await (await getDB()).Users.findOne({ attributes: ["pk", "uuid", "password", "email_verified_at"], where: { email: userData.email } });
    if (!findUser) throw new HttpException(false, 409, `This email ${userData.email} was not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(false, 409, "Password not matching");

    if(!findUser.email_verified_at) throw new HttpException(false, 400, "Email is not verified");
    
    const sessionData = await this.createUserSession({ 
      pk: findUser.pk, useragent: userAgent.source, ip_address: userAgent.ip_address
    });

    const TokenPayload = createAccessToken(findUser, sessionData);
    const { token } = TokenPayload;

    const cookie = createCookie(TokenPayload);
    return { cookie, accessToken: token };
  }

  /**
   * Logs out a user by ending their active session.
   * @param userData - The user object.
   * @param userSessionId - The session UUID to log out.
   * @returns Promise<boolean> - True if logout is successful.
   * @throws HttpException if user doesn't exist.
   */
  public async logout(userData: User, userSessionId: string): Promise<boolean> {
    const findUser: User = await (await getDB()).Users.findOne({ where: { pk: userData.pk } });
    if (!findUser) throw new HttpException(false, 409, "User doesn't exist");

    const logout = await this.logoutSessionActive({ uid: findUser.uuid, sid: userSessionId });
    return logout;
  }

  /**
   * Checks if a session is active by its UUID.
   * @param session_id - The session UUID.
   * @returns Promise<UserSession> - The session object or null.
   */
  public async checkSessionActive(session_id: string): Promise<UserSession> {
    const userSession = await (await getDB()).UsersSessions.findOne({ 
      where: { uuid: session_id, status: "ACTIVE" },
      include: [{ model: (await getDB()).Users, as: "user" }]
    });

    return userSession || null;
  };

  /**
   * Retrieves all roles assigned to a user by user ID.
   * @param user_id - The user's primary key.
   * @returns Promise<UserRole[]> - Array of user roles.
   */
  public async getUserRoles(user_id: number): Promise<UserRole[]> {
    const roles = await (await getDB()).UsersRoles.findAll({ 
      where: { user_id },
      include: [{ model: (await getDB()).Roles, as: "role" }]
    });

    return roles;
  };

  /**
   * Logs out an active session by updating its status.
   * @param data - Object containing user UUID and session UUID.
   * @returns Promise<boolean> - True if logout is successful.
   */
  public async logoutSessionActive(data: { uid: string, sid: string }): Promise<boolean> {
    const userSession = await (await getDB()).UsersSessions.findOne({ 
      where: { uuid: data.sid, status: "ACTIVE" },
      include: { model: (await getDB()).Users, as: "user" }
    });
  
    if (userSession) {
      userSession.status = "LOGOUT";
      await userSession.save();
      return true;
    } else {
      return true;
    }
  }

  /**
   * Creates a new user session with user agent and IP address.
   * @param data - Object containing user PK, user agent, and IP address.
   * @returns Promise<UserSession> - The created session object.
   */
  public async createUserSession(data: { pk: number, useragent: string, ip_address: string }): Promise<UserSession> {
    const session = await (await getDB()).UsersSessions.create({
      user_id: data.pk,
      useragent: data.useragent,
      ip_address: data.ip_address,
      status: "ACTIVE"
    });

    return session;
  };

  /**
   * Retrieves the role ID by role name.
   * @param name - The name of the role.
   * @returns Promise<number> - The role's primary key.
   */
  private async getRoleId(name: string): Promise<number> {
    const role = await (await getDB()).Roles.findOne({ where: { name }});
    return role.pk;
  }

  /**
   * Assigns a role to a user within a transaction.
   * @param user_id - The user's primary key.
   * @param role_id - The role's primary key.
   * @param transaction - The Sequelize transaction object.
   * @returns Promise<UserRole> - The created user role object.
   */
  private async asignUserRole(user_id: number, role_id: number, transaction: Transaction): Promise<UserRole> {
    const role = await (await getDB()).UsersRoles.create({ user_id, role_id }, { transaction });
    return role;
  }

  /**
   * Verifies a user's email using OTP.
   * @param user_uuid - The user's UUID.
   * @param otp - The OTP key.
   * @returns Promise<{ email: string }> - The verified email.
   * @throws HttpException if UUID or OTP is invalid.
   */
  public async verifyEmail(user_uuid: string, otp: string): Promise<{ email: string }> {
    const user = await (await getDB()).Users.findOne({ attributes: ["pk"], where: { uuid: user_uuid } } );
    if(!user) throw new HttpException(false, 400, "Invalid UUID");
    
    const valid = await new OTPService().findOTP({ 
      user_id: user.pk, key: otp, type: "EMAIL_VERIFICATION"
    });

    if(valid) {
      user.email_verified_at = new Date();

      await user.save();
    }

    return { email: user.email };
  };

  /**
   * Assigns a role to a user by UUID and role name, handling transaction and duplicate assignment.
   * @param user_uuid - The user's UUID.
   * @param role - The role name to assign.
   * @returns Promise<{ user_role: string }> - The assigned role name.
   * @throws HttpException if user or role not found, or assignment fails.
   */
  public async assignRoleToUser(user_uuid: string, role: string): Promise<{ user_role: string }> {
    const db = await getDB();
    const transaction = await db.sequelize.transaction();

    try {
      const user = await db.Users.findOne({ attributes: ["pk"], where: { uuid: user_uuid } });
      if (!user) {
        throw new HttpException(false, 404, "User not found");
      }
      const roleRecord = await db.Roles.findOne({ where: { name: role } });

      if (!roleRecord) {
        throw new HttpException(false, 404, `Role '${role}' not found`);
      }

      // Check if user already has this role
      const existingUserRole = await db.UsersRoles.findOne({ where: { user_id: user.pk, role_id: roleRecord.pk } });
      if (existingUserRole) {
        await transaction.rollback();
        return { user_role: roleRecord.name }; // Already assigned, return success
      }

      // Assign new role
      await this.asignUserRole(user.pk, roleRecord.pk, transaction);
      await transaction.commit();

      const userRole = await db.UsersRoles.findOne({ where: { user_id: user.pk, role_id: roleRecord.pk }, attributes: ["role_id"] });
      if (!userRole) {
        throw new HttpException(false, 500, "Failed to assign role to user");
      }

      // Return the assigned role name
      userRole.name = roleRecord.name; // Add name to the userRole object for response

      return { user_role: userRole.name };
    }catch (error){
      await transaction.rollback();
      throw error;
    }
  }
}