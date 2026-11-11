import { describe, expect, it } from "vitest";
import { ConflictError, NotFoundError } from "../../src/core/errors/app-error.js";
import type { User } from "../../src/modules/user/user.entity.js";
import type { IUserRepository } from "../../src/modules/user/user.repository.interface.js";
import { UserService } from "../../src/modules/user/user.service.js";

// Mock implementation of IUserRepository demonstrating Dependency Inversion (DIP)
class MockUserRepository implements IUserRepository {
  private users: User[] = [];

  public async create(userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    const user: User = {
      id: "mock-id-123",
      email: userData.email,
      name: userData.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  public async findById(id: string): Promise<User | null> {
    return this.users.find((u) => u.id === id) ?? null;
  }

  public async findByEmail(email: string): Promise<User | null> {
    return this.users.find((u) => u.email === email) ?? null;
  }

  public async findAll(): Promise<User[]> {
    return [...this.users];
  }
}

describe("UserService (SOLID / DIP Unit Tests)", () => {
  it("should successfully create a new user when email is unique", async () => {
    const mockRepo = new MockUserRepository();
    const service = new UserService(mockRepo);

    const created = await service.createUser({
      email: "test@example.com",
      name: "Test User",
    });

    expect(created.id).toBe("mock-id-123");
    expect(created.email).toBe("test@example.com");
    expect(created.name).toBe("Test User");
  });

  it("should throw ConflictError when attempting to register an existing email", async () => {
    const mockRepo = new MockUserRepository();
    const service = new UserService(mockRepo);

    await service.createUser({ email: "duplicate@example.com", name: "User 1" });

    await expect(
      service.createUser({ email: "duplicate@example.com", name: "User 2" }),
    ).rejects.toThrow(ConflictError);
  });

  it("should throw NotFoundError when user does not exist", async () => {
    const mockRepo = new MockUserRepository();
    const service = new UserService(mockRepo);

    await expect(service.getUserById("non-existent-id")).rejects.toThrow(NotFoundError);
  });

  it("should retrieve all users", async () => {
    const mockRepo = new MockUserRepository();
    const service = new UserService(mockRepo);

    await service.createUser({ email: "user1@example.com", name: "User 1" });
    await service.createUser({ email: "user2@example.com", name: "User 2" });

    const users = await service.getAllUsers();
    expect(users).toHaveLength(2);
  });
});
