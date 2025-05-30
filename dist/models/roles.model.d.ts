import { Sequelize, Model, Optional } from "sequelize";
import { Role } from "../interfaces/authentication/user-role.interface";
export type RoleCreationAttributes = Optional<Role, "pk" | "uuid">;
export declare class RoleModel extends Model<Role, RoleCreationAttributes> implements Role {
    pk: number;
    uuid: string;
    name: string;
    readonly created_at: Date;
    readonly updated_at: Date;
    readonly deleted_at: Date;
}
export default function (sequelize: Sequelize): typeof RoleModel;
