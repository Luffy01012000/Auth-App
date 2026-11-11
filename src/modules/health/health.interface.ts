export interface HealthIndicatorResult {
  status: "up" | "down";
  details?: Record<string, unknown>;
}

export interface IHealthIndicator {
  readonly name: string;
  check(): Promise<HealthIndicatorResult>;
}

export interface HealthReport {
  status: "ok" | "degraded" | "down";
  timestamp: string;
  checks: Record<string, HealthIndicatorResult>;
}

export interface IHealthService {
  getReport(): Promise<HealthReport>;
  isAlive(): Promise<boolean>;
  isReady(): Promise<boolean>;
}
