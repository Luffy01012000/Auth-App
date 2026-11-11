import { describe, expect, it } from "vitest";
import type {
  HealthIndicatorResult,
  IHealthIndicator,
} from "../../src/modules/health/health.interface.js";
import { HealthService } from "../../src/modules/health/health.service.js";

// Custom Mock Indicator demonstrating Strategy Pattern (Open/Closed Principle)
class MockIndicator implements IHealthIndicator {
  constructor(
    public readonly name: string,
    private readonly shouldPass: boolean,
  ) {}

  public async check(): Promise<HealthIndicatorResult> {
    if (!this.shouldPass) {
      return { status: "down", details: { reason: "Database unreachable" } };
    }
    return { status: "up", details: { latencyMs: 5 } };
  }
}

describe("HealthService (Strategy Pattern / OCP Unit Tests)", () => {
  it("should report status 'ok' when all strategies report up", async () => {
    const indicators: IHealthIndicator[] = [
      new MockIndicator("db", true),
      new MockIndicator("redis", true),
    ];
    const service = new HealthService(indicators);

    const report = await service.getReport();

    expect(report.status).toBe("ok");
    expect(report.checks.db?.status).toBe("up");
    expect(report.checks.redis?.status).toBe("up");
  });

  it("should report status 'degraded' if any strategy reports down", async () => {
    const indicators: IHealthIndicator[] = [
      new MockIndicator("db", true),
      new MockIndicator("redis", false),
    ];
    const service = new HealthService(indicators);

    const report = await service.getReport();

    expect(report.status).toBe("degraded");
    expect(report.checks.redis?.status).toBe("down");
  });

  it("should handle unexpected errors in indicators gracefully", async () => {
    const crashingIndicator: IHealthIndicator = {
      name: "crash-service",
      async check() {
        throw new Error("Connection failed abruptly");
      },
    };

    const service = new HealthService([crashingIndicator]);
    const report = await service.getReport();

    expect(report.status).toBe("degraded");
    expect(report.checks["crash-service"]?.status).toBe("down");
  });
});
