import { ConflictError, NotFoundError } from "../../core/errors/app-error.js";
import type { CreateUserDto } from "./dto/user.dto.js";
import type { User } from "./user.entity.js";
import type { IUserRepository } from "./user.repository.interface.js";
import type { IUserService } from "./user.service.interface.js";

export class UserService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  public async createUser(dto: CreateUserDto): Promise<User> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictError(`User with email '${dto.email}' already exists`);
    }

    return this.userRepository.create({
      email: dto.email,
      name: dto.name,
    });
  }

  public async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError(`User with id '${id}' not found`);
    }

    return user;
  }

  public async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}
