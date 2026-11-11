import { describe, expect, it } from "vitest";
import { env } from "../../src/config/env.js";

describe("Environment Configuration", () => {
  it("should have loaded valid environment variables", () => {
    expect(env).toBeDefined();
    expect(typeof env.PORT).toBe("number");
    expect(["development", "test", "production"]).toContain(env.NODE_ENV);
    expect(typeof env.CORS_ORIGIN).toBe("string");
  });
});
