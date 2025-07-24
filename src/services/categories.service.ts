// Import Service decorator from typedi for dependency injection
import { Service } from "typedi";
// Import function to get database instance lazily
import { getDB } from "@/database/db-lazy";
// Import Category interface for category data structure
import { Category } from '@interfaces/category.interface';
// Import custom HTTP exception for error handling
import { HttpException } from "@exceptions/HttpException";
// Import DTOs for creating and updating categories
import { CreateCategoryDto, UpdateCategoryDto } from '@dtos/categories.dto';

/**
 * Service class for category-related operations.
 * Handles CRUD operations for categories.
 */
@Service()
export class CategoryService {
  /**
   * Retrieves all categories from the database.
   * @returns Promise<Category[]> - Array of category objects.
   */
  public async getCategories(): Promise<Category[]> {
    return await (await getDB()).Categories.findAll({ 
      attributes: { 
        exclude: ["pk"],
      },
    });
  }

  /**
   * Creates a new category in the database.
   * @param data - DTO containing category creation fields.
   * @returns Promise<Category> - The created category object.
   */
  public async createCategory(data: CreateCategoryDto): Promise<Category> {
    const category = await (await getDB()).Categories.create({ ...data });
    delete category.dataValues.pk;

    return category;
  }
  
  /**
   * Updates an existing category by its UUID.
   * @param category_id - The UUID of the category.
   * @param data - DTO containing category update fields.
   * @returns Promise<Category> - The updated category object.
   * @throws HttpException if no fields are provided.
   */
  public async updateCategory(category_id: string, data: UpdateCategoryDto): Promise<Category> {
    const updatedData: any = {};
    
    if (data.name) updatedData.name = data.name;
    if (data.description) updatedData.description = data.description;

    if (Object.keys(updatedData).length === 0) {
      throw new HttpException(false, 400, "Some field is required");
    }

    const [_, [category]] = await (await getDB()).Categories.update(updatedData, {
      where: { uuid: category_id },
      returning: true,
    });
    
    delete category.dataValues.pk;

    return category;
  }

  /**
   * Deletes a category by its UUID.
   * @param category_id - The UUID of the category.
   * @returns Promise<boolean> - True if deletion is successful.
   * @throws HttpException if category is not found.
   */
  public async deleteCategory(category_id: string): Promise<boolean> {
    const category = await (await getDB()).Categories.findOne({ where: { uuid: category_id }});

    if(!category) {
      throw new HttpException(false, 400, "Category is not found");
    }

    await category.destroy();
    return true;
  }
}