import type { HealthIndicatorResult, IHealthIndicator } from "../health.interface.js";

export class MemoryHealthIndicator implements IHealthIndicator {
  public readonly name = "memory";

  public async check(): Promise<HealthIndicatorResult> {
    const memory = process.memoryUsage();
    // Example threshold: alert if heapUsed exceeds 1.5 GB
    const maxHeapBytes = 1.5 * 1024 * 1024 * 1024;
    const isHealthy = memory.heapUsed < maxHeapBytes;

    return {
      status: isHealthy ? "up" : "down",
      details: {
        rss: `${Math.round(memory.rss / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memory.heapUsed / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memory.heapTotal / 1024 / 1024)}MB`,
      },
    };
  }
}
