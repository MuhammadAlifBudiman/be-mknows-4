import { Sequelize, Model, Optional } from "sequelize";
import { User } from "../interfaces/user.interface";
export type UserCreationAttributes = Optional<User, "pk" | "uuid" | "full_name" | "display_picture">;
export declare class UserModel extends Model<User, UserCreationAttributes> implements User {
    pk: number;
    uuid: string;
    full_name: string;
    display_picture: number;
    email: string;
    password: string;
    email_verified_at: Date;
    readonly created_at: Date;
    readonly updated_at: Date;
    readonly deleted_at: Date;
}
export default function (sequelize: Sequelize): typeof UserModel;
