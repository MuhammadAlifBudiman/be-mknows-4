import { Sequelize, Model, Optional } from "sequelize";
import { UserSession } from "../interfaces/user-session.interface";
import { UserModel } from "./users.model";
export type UserSessionCreationAttributes = Optional<UserSession, "pk" | "uuid">;
export declare class UserSessionModel extends Model<UserSession, UserSessionCreationAttributes> implements UserSessionCreationAttributes {
    pk: number;
    uuid: string;
    user_id: number;
    useragent: string;
    ip_address: string;
    status: string;
    readonly user: UserModel;
    readonly created_at: Date;
    readonly updated_at: Date;
    readonly deleted_at: Date;
}
export default function (sequelize: Sequelize): typeof UserSessionModel;
