import { Sequelize, Model, Optional } from "sequelize";
import { OTP } from "../interfaces/otp.interface";
export type OTPCreationAttributes = Optional<OTP, "pk" | "uuid">;
export declare class OTPModel extends Model<OTP, OTPCreationAttributes> implements OTP {
    pk: number;
    uuid: string;
    user_id: number;
    key: string;
    type: string;
    status: string;
    expired_at: Date;
    readonly created_at: Date;
    readonly updated_at: Date;
    readonly deleted_at: Date;
}
export default function (sequelize: Sequelize): typeof OTPModel;
