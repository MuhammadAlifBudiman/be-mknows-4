/**
 * Sequelize model definition for user sessions.
 * Represents session entities for user authentication and tracking.
 */
import { Sequelize, DataTypes, Model, Optional } from "sequelize";
import { UserSession } from "@interfaces/user-session.interface";
import { UserModel } from "@models/users.model";

/**
 * Type for user session creation attributes, omitting pk and uuid for auto-generation.
 */
export type UserSessionCreationAttributes = Optional<UserSession, "pk" | "uuid">;

/**
 * UserSessionModel class for Sequelize ORM.
 * Implements UserSession interface. Attributes are handled by Sequelize.
 */
export class UserSessionModel extends Model<UserSession, UserSessionCreationAttributes> {
  uuid: string; // Session UUID
  // No public fields here! Let Sequelize handle attributes.
}

/**
 * Initializes the UserSessionModel with Sequelize instance and sets up model fields and associations.
 * @param sequelize - Sequelize connection instance
 * @returns UserSessionModel class
 */
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
      tableName: "users_sessions", // Table name in DB
      timestamps: true,             // Enable created_at/updated_at
      paranoid: true,               // Enable soft deletes (deleted_at)
      sequelize,                    // Sequelize instance
    },
  );

  // Set up association to UserModel
  UserSessionModel.belongsTo(UserModel, {
    foreignKey: "user_id",
    as: "user"
  });

  return UserSessionModel;
}