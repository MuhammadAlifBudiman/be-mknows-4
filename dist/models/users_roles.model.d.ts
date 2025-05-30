import { Sequelize, Model } from "sequelize";
import { UserRole } from "../interfaces/authentication/user-role.interface";
import { RoleModel } from "./roles.model";
export type UserRoleCreationAttributes = UserRole;
export declare class UserRoleModel extends Model<UserRole, UserRoleCreationAttributes> implements UserRole {
    user_id: number;
    role_id: number;
    role?: RoleModel;
    readonly created_at: Date;
    readonly updated_at: Date;
    readonly deleted_at: Date;
}
export default function (sequelize: Sequelize): typeof UserRoleModel;
