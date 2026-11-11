import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../src/app.js";

describe("Error Handler Middleware (Integration)", () => {
  const app = createApp();

  it("should return 404 with structured error for undefined route", async () => {
    const response = await request(app).get("/api/v1/unknown-endpoint");

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("NOT_FOUND");
    expect(response.body.error.message).toContain("Route GET /api/v1/unknown-endpoint not found");
  });

  it("should return 400 for malformed JSON body", async () => {
    const response = await request(app)
      .post("/api/v1/users")
      .set("Content-Type", "application/json")
      .send("{ invalid-json-payload ");

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("BAD_REQUEST");
  });
});
