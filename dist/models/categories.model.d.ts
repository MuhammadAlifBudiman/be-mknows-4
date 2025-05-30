import { Sequelize, Model, Optional } from "sequelize";
import { Category } from "../interfaces/category.interface";
export type CategoryCreationAttributes = Optional<Category, "pk" | "uuid">;
export declare class CategoryModel extends Model<Category, CategoryCreationAttributes> implements Category {
    pk: number;
    uuid: string;
    name: string;
    description: string;
    readonly created_at: Date;
    readonly updated_at: Date;
    readonly deleted_at: Date;
}
export default function (sequelize: Sequelize): typeof CategoryModel;
