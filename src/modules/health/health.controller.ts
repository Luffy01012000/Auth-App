import type { Request, Response } from "express";
import { createSuccessResponse } from "../../core/http/api-response.js";
import type { IHealthService } from "./health.interface.js";

export class HealthController {
  constructor(private readonly healthService: IHealthService) {}

  public check = async (_req: Request, res: Response): Promise<void> => {
    const report = await this.healthService.getReport();
    const httpStatus = report.status === "down" ? 503 : 200;
    res.status(httpStatus).json(createSuccessResponse(report));
  };

  public live = async (_req: Request, res: Response): Promise<void> => {
    const alive = await this.healthService.isAlive();
    res.status(alive ? 200 : 503).json(createSuccessResponse({ status: "alive" }));
  };

  public ready = async (_req: Request, res: Response): Promise<void> => {
    const ready = await this.healthService.isReady();
    res.status(ready ? 200 : 503).json(createSuccessResponse({ status: "ready" }));
  };
}
