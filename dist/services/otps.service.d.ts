import { Transaction } from "sequelize";
import { OTP } from "../interfaces/otp.interface";
export declare class OTPService {
    createOTP(data: any, validInMinutes: number, transaction: Transaction): Promise<OTP>;
    findOTP(data: {
        user_id: number;
        key: string;
        type: string;
    }): Promise<boolean>;
}
