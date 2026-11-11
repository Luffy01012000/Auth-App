import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../src/app.js";

describe("User API Endpoints (Integration)", () => {
  const app = createApp();

  it("POST /api/v1/users should create a user and return 201", async () => {
    const payload = {
      email: "alice@example.com",
      name: "Alice Smith",
    };

    const response = await request(app).post("/api/v1/users").send(payload);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.email).toBe("alice@example.com");
    expect(response.body.data.name).toBe("Alice Smith");
    expect(response.body.data.id).toBeDefined();
  });

  it("POST /api/v1/users should fail with 400 when payload is invalid", async () => {
    const payload = {
      email: "not-an-email",
      name: "A", // too short (min 2)
    };

    const response = await request(app).post("/api/v1/users").send(payload);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
    expect(response.body.error.details).toBeDefined();
  });

  it("POST /api/v1/users should return 409 when email already exists", async () => {
    const payload = {
      email: "duplicate@example.com",
      name: "Duplicate User",
    };

    await request(app).post("/api/v1/users").send(payload);
    const conflictResponse = await request(app).post("/api/v1/users").send(payload);

    expect(conflictResponse.status).toBe(409);
    expect(conflictResponse.body.success).toBe(false);
    expect(conflictResponse.body.error.code).toBe("CONFLICT");
  });

  it("GET /api/v1/users should return all users", async () => {
    const response = await request(app).get("/api/v1/users");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it("GET /api/v1/users/:id should return 404 for unknown user", async () => {
    const response = await request(app).get("/api/v1/users/non-existent-id");

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("NOT_FOUND");
  });
});
