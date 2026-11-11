import type { HealthIndicatorResult, IHealthIndicator } from "../health.interface.js";

export class UptimeHealthIndicator implements IHealthIndicator {
  public readonly name = "uptime";

  public async check(): Promise<HealthIndicatorResult> {
    const uptimeSeconds = process.uptime();

    return {
      status: "up",
      details: {
        uptimeSeconds: Math.floor(uptimeSeconds),
        uptimeFormatted: `${Math.floor(uptimeSeconds / 60)}m ${Math.floor(uptimeSeconds % 60)}s`,
      },
    };
  }
}
