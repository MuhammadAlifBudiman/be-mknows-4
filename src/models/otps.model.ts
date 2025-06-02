import { Sequelize, DataTypes, Model, Optional } from "sequelize";

import { OTP } from "@interfaces/otp.interface";

export type OTPCreationAttributes = Optional<OTP, "pk" | "uuid">;

export class OTPModel extends Model<OTP, OTPCreationAttributes> {
  // remove public class field declarations to avoid shadowing Sequelize's attribute getters and setters
}

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
        // references: {
        //   model: UserModel,
        //   key: "pk",
        // },
        // onDelete: "CASCADE",
        // onUpdate: "CASCADE",
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
      tableName: "otps",
      timestamps: true,
      paranoid: true,
      sequelize
    },
  );

  return OTPModel;
}