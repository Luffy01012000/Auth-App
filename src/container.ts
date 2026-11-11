import type { ILogger } from "./core/logger/logger.interface.js";
import { WinstonLogger } from "./core/logger/winston-logger.js";
import { HealthController } from "./modules/health/health.controller.js";
import type { IHealthIndicator, IHealthService } from "./modules/health/health.interface.js";
import { HealthService } from "./modules/health/health.service.js";
import { MemoryHealthIndicator } from "./modules/health/indicators/memory.indicator.js";
import { UptimeHealthIndicator } from "./modules/health/indicators/uptime.indicator.js";
import { UserController } from "./modules/user/user.controller.js";
import type { IUserRepository } from "./modules/user/user.repository.interface.js";
import { InMemoryUserRepository } from "./modules/user/user.repository.memory.js";
import type { IUserService } from "./modules/user/user.service.interface.js";
import { UserService } from "./modules/user/user.service.js";

export interface Container {
  logger: ILogger;
  healthService: IHealthService;
  healthController: HealthController;
  userRepository: IUserRepository;
  userService: IUserService;
  userController: UserController;
}

export function createContainer(): Container {
  // 1. Core infrastructure
  const logger: ILogger = new WinstonLogger();

  // 2. Health module (Strategy Pattern)
  const healthIndicators: IHealthIndicator[] = [
    new MemoryHealthIndicator(),
    new UptimeHealthIndicator(),
  ];
  const healthService: IHealthService = new HealthService(healthIndicators);
  const healthController = new HealthController(healthService);

  // 3. User domain module (Layered Architecture & DIP)
  const userRepository: IUserRepository = new InMemoryUserRepository();
  const userService: IUserService = new UserService(userRepository);
  const userController = new UserController(userService);

  return {
    logger,
    healthService,
    healthController,
    userRepository,
    userService,
    userController,
  };
}
