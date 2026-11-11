import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../src/app.js";

describe("Health Endpoints (Integration)", () => {
  const app = createApp();

  it("GET /health should return 200 and system health report", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe("ok");
    expect(response.body.data.checks.memory).toBeDefined();
    expect(response.body.data.checks.uptime).toBeDefined();
  });

  it("GET /health/live should return 200 alive status", async () => {
    const response = await request(app).get("/health/live");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe("alive");
  });

  it("GET /health/ready should return 200 ready status", async () => {
    const response = await request(app).get("/health/ready");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe("ready");
  });
});
