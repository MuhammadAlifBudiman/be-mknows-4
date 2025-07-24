/**
 * Sequelize model definition for roles.
 * Represents role entities for user authorization and access control.
 */
import { Sequelize, DataTypes, Model, Optional } from "sequelize";
import { Role } from "@interfaces/authentication/user-role.interface";

/**
 * Type for role creation attributes, omitting pk and uuid for auto-generation.
 */
export type RoleCreationAttributes = Optional<Role, "pk" | "uuid">;

/**
 * RoleModel class for Sequelize ORM.
 * Implements Role interface. Attributes are handled by Sequelize.
 */
export class RoleModel extends Model<Role, RoleCreationAttributes> {
  // No public fields here! Let Sequelize handle attributes.
}

/**
 * Initializes the RoleModel with Sequelize instance and sets up model fields.
 * @param sequelize - Sequelize connection instance
 * @returns RoleModel class
 */
export default function (sequelize: Sequelize): typeof RoleModel {
  RoleModel.init(
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
        unique: true
      },
      name: {
        allowNull: true,
        type: DataTypes.STRING(52),
        unique: true
      },
    },
    {
      tableName: "roles", // Table name in DB
      timestamps: true,    // Enable created_at/updated_at
      paranoid: true,      // Enable soft deletes (deleted_at)
      sequelize            // Sequelize instance
    },
  );

  return RoleModel;
}