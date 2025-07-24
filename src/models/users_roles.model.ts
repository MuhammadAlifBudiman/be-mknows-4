/**
 * Sequelize model definition for user-role relationships.
 * Represents the association between users and roles, including many-to-many and one-to-many relationships.
 */
import { Sequelize, DataTypes, Model } from "sequelize";
import { UserRole } from "@interfaces/authentication/user-role.interface";

import { RoleModel } from "@models/roles.model";
import { UserModel } from "@models/users.model";

/**
 * Type for user-role creation attributes.
 */
export type UserRoleCreationAttributes = UserRole;

/**
 * UserRoleModel class for Sequelize ORM.
 * Implements UserRole interface. Attributes are handled by Sequelize.
 */
export class UserRoleModel extends Model<UserRole, UserRoleCreationAttributes> {
  // No public fields here! Let Sequelize handle attributes.
}

/**
 * Initializes the UserRoleModel with Sequelize instance and sets up associations.
 * @param sequelize - Sequelize connection instance
 * @returns UserRoleModel class
 */
export default function (sequelize: Sequelize): typeof UserRoleModel {
  UserRoleModel.init(
    {
      user_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      role_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: "users_roles", // Table name in DB
      timestamps: true,          // Enable created_at/updated_at
      paranoid: true,            // Enable soft deletes (deleted_at)
      sequelize,                 // Sequelize instance
    },
  );

  // Set up many-to-many and one-to-many associations
  UserModel.belongsToMany(RoleModel, { through: UserRoleModel, foreignKey: "user_id" });
  RoleModel.belongsToMany(UserModel, { through: UserRoleModel, foreignKey: "role_id" });

  UserModel.hasMany(UserRoleModel);
  UserRoleModel.belongsTo(UserModel);

  RoleModel.hasMany(UserRoleModel);
  UserRoleModel.belongsTo(RoleModel, { foreignKey: "role_id", as: "role" });

  return UserRoleModel;
}