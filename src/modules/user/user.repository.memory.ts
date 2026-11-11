import { randomUUID } from "node:crypto";
import type { User } from "./user.entity.js";
import type { IUserRepository } from "./user.repository.interface.js";

export class InMemoryUserRepository implements IUserRepository {
  private readonly users = new Map<string, User>();

  public async create(userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    const now = new Date();
    const user: User = {
      id: randomUUID(),
      email: userData.email.toLowerCase(),
      name: userData.name,
      createdAt: now,
      updatedAt: now,
    };

    this.users.set(user.id, user);
    return user;
  }

  public async findById(id: string): Promise<User | null> {
    return this.users.get(id) ?? null;
  }

  public async findByEmail(email: string): Promise<User | null> {
    const targetEmail = email.toLowerCase();
    for (const user of this.users.values()) {
      if (user.email === targetEmail) {
        return user;
      }
    }
    return null;
  }

  public async findAll(): Promise<User[]> {
    return Array.from(this.users.values());
  }
}
