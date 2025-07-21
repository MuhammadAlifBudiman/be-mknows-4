import { hash } from "bcrypt";
import { Service } from "typedi";
import { getDB } from "@/database/db-lazy";
import { CreateUserDto } from "@dtos/users.dto";
import { HttpException } from "@/exceptions/HttpException";
import { User } from "@interfaces/user.interface";

@Service()
export class UserService {
  public async findAllUser(): Promise<User[]> {
    const db = await getDB();
    const allUser: User[] = await db.Users.findAll();
    return allUser;
  }

  public async findUserById(userId: number): Promise<User> {
    const db = await getDB();
    const findUser: User = await db.Users.findByPk(userId);
    if (!findUser) throw new HttpException(false, 409, "User doesn't exist");
    return findUser;
  }

  public async findUserByUUID(user_uuid: string): Promise<User>{
    const db = await getDB();
    const findUser: User = await db.Users.findOne({ where: { uuid: user_uuid } });
    if (!findUser) throw new HttpException(false, 409, "User doesn't exist");
    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    const db = await getDB();
    const findUser: User = await db.Users.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(false, 409, `This email ${userData.email} already exists`);
    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await db.Users.create({ ...userData, password: hashedPassword });
    return createUserData;
  }

  public async updateUser(user_uuid: string, userData: CreateUserDto): Promise<User> {
    const db = await getDB();
    const findUser: User = await db.Users.findOne({ where: { uuid: user_uuid } });
    if (!findUser) throw new HttpException(false, 409, "User doesn't exist");
    const hashedPassword = await hash(userData.password, 10);
    await db.Users.update({ ...userData, password: hashedPassword }, { where: { uuid: user_uuid } });
    const updateUser: User = await db.Users.findOne({ where: { uuid: user_uuid } });
    return updateUser;
  }

  public async deleteUser(user_uuid: string): Promise<User> {
    const db = await getDB();
    const findUser: User = await db.Users.findOne({ where: { uuid: user_uuid } });
    if (!findUser) throw new HttpException(false, 409, "User doesn't exist");
    await db.Users.destroy({ where: { uuid: user_uuid } });
    return findUser;
  }
}