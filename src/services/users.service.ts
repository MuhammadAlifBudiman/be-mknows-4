// Import bcrypt for password hashing
import { hash } from "bcrypt";
// Import Service decorator from typedi for dependency injection
import { Service } from "typedi";
// Import function to get database instance lazily
import { getDB } from "@/database/db-lazy";
// Import DTO for user creation and update
import { CreateUserDto } from "@dtos/users.dto";
// Import custom HTTP exception for error handling
import { HttpException } from "@exceptions/HttpException";
// Import User interface for user data structure
import { User } from "@interfaces/user.interface";

/**
 * Service class for user-related operations.
 * Handles CRUD operations for users, including password hashing and error handling.
 */
@Service()
export class UserService {
  /**
   * Retrieves all users from the database.
   * @returns Promise<User[]> - Array of user objects.
   */
  public async findAllUser(): Promise<User[]> {
    const db = await getDB();
    const allUser: User[] = await db.Users.findAll();
    return allUser;
  }

  /**
   * Finds a user by their primary key (ID).
   * @param userId - The user's primary key.
   * @returns Promise<User> - The user object.
   * @throws HttpException if user doesn't exist.
   */
  public async findUserById(userId: number): Promise<User> {
    const db = await getDB();
    const findUser: User = await db.Users.findByPk(userId);
    if (!findUser) throw new HttpException(false, 409, "User doesn't exist");
    return findUser;
  }

  /**
   * Finds a user by their UUID.
   * @param user_uuid - The user's UUID.
   * @returns Promise<User> - The user object.
   * @throws HttpException if user doesn't exist.
   */
  public async findUserByUUID(user_uuid: string): Promise<User>{
    const db = await getDB();
    const findUser: User = await db.Users.findOne({ where: { uuid: user_uuid } });
    if (!findUser) throw new HttpException(false, 409, "User doesn't exist");
    return findUser;
  }

  /**
   * Creates a new user with hashed password.
   * @param userData - DTO containing user creation fields.
   * @returns Promise<User> - The created user object.
   * @throws HttpException if email already exists.
   */
  public async createUser(userData: CreateUserDto): Promise<User> {
    const db = await getDB();
    const findUser: User = await db.Users.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(false, 409, `This email ${userData.email} already exists`);
    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await db.Users.create({ ...userData, password: hashedPassword });
    return createUserData;
  }

  /**
   * Updates an existing user by UUID, including password hashing.
   * @param user_uuid - The user's UUID.
   * @param userData - DTO containing user update fields.
   * @returns Promise<User> - The updated user object.
   * @throws HttpException if user doesn't exist.
   */
  public async updateUser(user_uuid: string, userData: CreateUserDto): Promise<User> {
    const db = await getDB();
    const findUser: User = await db.Users.findOne({ where: { uuid: user_uuid } });
    if (!findUser) throw new HttpException(false, 409, "User doesn't exist");
    const hashedPassword = await hash(userData.password, 10);
    await db.Users.update({ ...userData, password: hashedPassword }, { where: { uuid: user_uuid } });
    const updateUser: User = await db.Users.findOne({ where: { uuid: user_uuid } });
    return updateUser;
  }

  /**
   * Deletes a user by their UUID.
   * @param user_uuid - The user's UUID.
   * @returns Promise<User> - The deleted user object.
   * @throws HttpException if user doesn't exist.
   */
  public async deleteUser(user_uuid: string): Promise<User> {
    const db = await getDB();
    const findUser: User = await db.Users.findOne({ where: { uuid: user_uuid } });
    if (!findUser) throw new HttpException(false, 409, "User doesn't exist");
    await db.Users.destroy({ where: { uuid: user_uuid } });
    return findUser;
  }
}