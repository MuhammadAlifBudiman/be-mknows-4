import { Sequelize, DataTypes, Model, Optional } from "sequelize";
import { UserSession } from "@interfaces/user-session.interface";

import { UserModel } from "@models/users.model";

export type UserSessionCreationAttributes = Optional<UserSession, "pk" | "uuid">;

export class UserSessionModel extends Model<UserSession, UserSessionCreationAttributes> {
  uuid: string;
  // No public fields here! Let Sequelize handle attributes.
}

export default function (sequelize: Sequelize): typeof UserSessionModel {
  UserSessionModel.init(
    {
      pk: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      uuid: {
        allowNull: true,
        defaultValue: DataTypes.UUIDV4,
        type: DataTypes.STRING(52),
      },
      user_id: {
        allowNull: false,
        type: DataTypes.INTEGER(),
      },
      useragent: {
        allowNull: false,
        type: DataTypes.STRING(320),
      },
      ip_address: {
        allowNull: false,
        type: DataTypes.STRING(64),
      },
      status: {
        allowNull: false,
        type: DataTypes.STRING(512),
      },
    },
    {
      tableName: "users_sessions",
      timestamps: true,
      paranoid: true,
      sequelize,
    },
  );

  UserSessionModel.belongsTo(UserModel, {
    foreignKey: "user_id",
    as: "user"
  });

  return UserSessionModel;
}