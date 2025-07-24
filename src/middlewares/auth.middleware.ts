/**
 * Authentication middleware for Express routes.
 * Handles JWT verification, user session validation, and role-based authorization.
 */
import { Request, Response, NextFunction } from "express"; // Express types
import { verify } from "jsonwebtoken"; // JWT verification

import { SECRET_KEY } from "@config/index"; // Secret key for JWT
import { HttpException } from "@exceptions/HttpException"; // Custom HTTP exception

import { UserRole } from "@interfaces/authentication/user-role.interface"; // User role interface
import { UserSession } from "@interfaces/user-session.interface"; // User session interface
import { UserAgent } from "@interfaces/common/useragent.interface"; // User agent interface
import { DataStoredInToken, RequestWithUser } from "@interfaces/authentication/token.interface"; // Token and request interfaces

import { AuthService } from "@services/auth.service"; // Auth service
import { getUserAgent } from "@utils/userAgent"; // User agent utility

/**
 * Helper to get the Authorization token from cookies or headers.
 * @param req - Express request
 * @returns {string|null} Authorization token or null
 */
const getAuthorization = (req: Request) => {
  const coockie = req.cookies["Authorization"];
  if (coockie) return coockie;

  const header = req.header("Authorization");
  if (header) return header.split("Bearer ")[1];

  return null;
};

/**
 * Middleware to restrict access to users with specific roles.
 * @param roles - Array of allowed role names
 * @returns Express middleware function
 */
export const AuthorizedRoles = (roles: string[]) => {
  return async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const userRoles = req.user_roles;
    const hasRequiredRole = roles.some(requiredRole => userRoles.includes(requiredRole));

    if (hasRequiredRole) {
      next();
    } else {
      next(new HttpException(false, 403, "Unauthorized Access #37"));
    }
  };
};

/**
 * Main authentication middleware for protected routes.
 * Verifies JWT, checks session, validates user agent, and attaches user info to request.
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next middleware
 */
export const AuthMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const auth = new AuthService();
    const Authorization: string = getAuthorization(req);
    const userAgentPayload: UserAgent = getUserAgent(req);

    if (Authorization) {
      const { uid, sid } = verify(Authorization, SECRET_KEY) as DataStoredInToken;
      const userSession: UserSession = await auth.checkSessionActive(sid);
      const userRoles: UserRole[] = await auth.getUserRoles(userSession.user.pk);

      if (userSession?.user?.uuid === uid) {
        if(userAgentPayload.source === userSession.useragent) {
          req.session_id = sid;
          req.user = userSession.user;
          req.user_roles = userRoles.map(userRole => userRole.role.name);

          next();
        } else {
          next(new HttpException(false, 401, "Invalid Token #60"));
        }
      } else {
        next(new HttpException(false, 401, "Invalid Token #63"));
      }
    } else {
      next(new HttpException(false, 401, "Invalid Token #66"));
    }
  } catch (error) {
    next(new HttpException(false, 401, "Invalid Token #70"));
  }
};