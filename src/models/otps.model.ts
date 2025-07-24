/**
 * Sequelize model definition for OTPs (One-Time Passwords).
 * Represents OTP entities for user authentication and verification.
 */
import { Sequelize, DataTypes, Model, Optional } from "sequelize";

import { OTP } from "@interfaces/otp.interface";

/**
 * Type for OTP creation attributes, omitting pk and uuid for auto-generation.
 */
export type OTPCreationAttributes = Optional<OTP, "pk" | "uuid">;

/**
 * OTPModel class for Sequelize ORM.
 * Implements OTP interface. Attributes are handled by Sequelize.
 */
export class OTPModel extends Model<OTP, OTPCreationAttributes> {
  // No public fields here! Let Sequelize handle attributes.
}

/**
 * Initializes the OTPModel with Sequelize instance and sets up model fields.
 * @param sequelize - Sequelize connection instance
 * @returns OTPModel class
 */
export default function (sequelize: Sequelize): typeof OTPModel {
  OTPModel.init(
    {
      pk: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // references: UserModel, key: "pk"
        // onDelete/onUpdate: "CASCADE"
      },
      key: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expired_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: "otps", // Table name in DB
      timestamps: true,    // Enable created_at/updated_at
      paranoid: true,      // Enable soft deletes (deleted_at)
      sequelize            // Sequelize instance
    },
  );

  return OTPModel;
}