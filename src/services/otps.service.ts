// Import Service decorator from typedi for dependency injection
import { Service } from "typedi";
// Import Sequelize Transaction type for transactional operations
import { Transaction } from "sequelize";
// Import function to get database instance lazily
import { getDB } from "@/database/db-lazy";
// Import OTP interface for OTP data structure
import { OTP } from "@interfaces/otp.interface";
// Import custom HTTP exception for error handling
import { HttpException } from "@exceptions/HttpException";

/**
 * Service class for OTP-related operations.
 * Handles OTP creation, validation, expiration, and status updates.
 */
@Service()
export class OTPService {
  /**
   * Creates a new OTP for a user and stores it in the database.
   * @param data - Object containing user_id and OTP type.
   * @param validInMinutes - Number of minutes the OTP is valid for.
   * @param transaction - Sequelize transaction for atomic operation.
   * @returns Promise<OTP> - The created OTP object.
   */
  public async createOTP(data, validInMinutes: number, transaction: Transaction): Promise<OTP> {
    // untuk generate otp || validInMinutes = mau valid berapa menit si otpnya
    const key = Math.floor(Math.pow(10, 8 - 1) + Math.random() * 9 * Math.pow(10, 8 - 1)).toString();
    const currentDateTime = new Date();
    const expirationTime = new Date(currentDateTime.getTime() + validInMinutes * 60000);
  
    const otp = await (await getDB()).OTPs.create({
      user_id: data.user_id,
      key,
      type: data.type,
      status: "AVAILABLE",
      expired_at: expirationTime,
    }, { transaction });

    return otp;
  }

  /**
   * Finds and validates an OTP for a user, updating its status if used or expired.
   * @param data - Object containing user_id, key, and type of OTP.
   * @returns Promise<boolean> - True if OTP is valid and used.
   * @throws HttpException if OTP is not valid or expired.
   */
  public async findOTP(data: { user_id: number, key: string, type: string }): Promise<boolean> {
    const otp = await (await getDB()).OTPs.findOne({
      where: {
        user_id: data.user_id,
        key: data.key,
        status: "AVAILABLE",
      }
    });

    if(!otp) {
      throw new HttpException(false, 400, "OTP is not valid");
    }

    if(new Date(otp.expired_at) < new Date()) {
      otp.status = "EXPIRED";
      await otp.save();

      throw new HttpException(false, 400, "OTP is not valid");
    }

    otp.status = "USED";
    await otp.save();

    return true;
  }
}