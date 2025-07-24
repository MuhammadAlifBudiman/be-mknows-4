/**
 * Error handling middleware for Express routes.
 * Logs errors and sends standardized error responses based on error type.
 */
import { NextFunction, Request, Response } from "express"; // Express types
import { HttpException } from "@exceptions/HttpException"; // Custom HTTP exception
import { logger } from "@utils/logger"; // Logger utility

/**
 * Main error middleware for handling exceptions and formatting error responses.
 * @param error - The error object (HttpException)
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next middleware
 */
export const ErrorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    const status: number = error.status || 500; // HTTP status code
    const message: string = error.message || "Something went wrong"; // Error message
    const errors: string[] = error.errors || []; // Array of error details
    // const success: boolean = error.success || false;

    // Handle specific error messages for property and UUID errors
    if(message.endsWith("does not exist")) {
      logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
      res.status(400).json({ code: 400, status: "BAD REQUEST", message: "Invalid Property", errors });
    } else if(message.startsWith("invalid input syntax for")) {
      logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
      res.status(400).json({ code: 400, status: "BAD REQUEST", message: "Invalid UUID", errors });
    } else {
      // Default error response
      logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
      res.status(status).json({ code: status, status: "BAD REQUEST", message, errors });
    }
  } catch (error) {
    // Pass error to next middleware if something goes wrong
    next(error);
  }
};