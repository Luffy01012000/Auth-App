import type { CreateUserDto } from "./dto/user.dto.js";
import type { User } from "./user.entity.js";

export interface IUserService {
  createUser(dto: CreateUserDto): Promise<User>;
  getUserById(id: string): Promise<User>;
  getAllUsers(): Promise<User[]>;
}
