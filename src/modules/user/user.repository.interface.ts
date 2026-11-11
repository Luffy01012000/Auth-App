import type { User } from "./user.entity.js";

export interface IUserRepository {
  create(userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
}
