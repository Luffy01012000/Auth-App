import type { HealthReport, IHealthIndicator, IHealthService } from "./health.interface.js";

export class HealthService implements IHealthService {
  constructor(private readonly indicators: IHealthIndicator[]) {}

  public async getReport(): Promise<HealthReport> {
    const checks: HealthReport["checks"] = {};
    let overallStatus: HealthReport["status"] = "ok";

    for (const indicator of this.indicators) {
      try {
        const result = await indicator.check();
        checks[indicator.name] = result;
        if (result.status === "down") {
          overallStatus = "degraded";
        }
      } catch (error) {
        checks[indicator.name] = {
          status: "down",
          details: { error: error instanceof Error ? error.message : "Indicator check failed" },
        };
        overallStatus = "degraded";
      }
    }

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      checks,
    };
  }

  public async isAlive(): Promise<boolean> {
    return true;
  }

  public async isReady(): Promise<boolean> {
    const report = await this.getReport();
    return report.status !== "down";
  }
}
