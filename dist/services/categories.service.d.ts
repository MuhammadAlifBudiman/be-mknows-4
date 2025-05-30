import { Category } from '../interfaces/category.interface';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/categories.dto';
export declare class CategoryService {
    getCategories(): Promise<Category[]>;
    createCategory(data: CreateCategoryDto): Promise<Category>;
    updateCategory(category_id: string, data: UpdateCategoryDto): Promise<Category>;
    deleteCategory(category_id: string): Promise<boolean>;
}
