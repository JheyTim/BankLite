import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

/**
 * Reusable health controller.
 * Kubernetes can later use these endpoints for liveness and readiness probes.
 */
@Controller('health')
export class HealthController {
  constructor(
    /**
     * NestJS health check service.
     */
    private readonly health: HealthCheckService,
  ) {}

  /**
   * Liveness check.
   * This confirms the service process is running.
   */
  @Get('live')
  @HealthCheck()
  live() {
    return this.health.check([]);
  }

  /**
   * Readiness check.
   * Later, this can include PostgreSQL, Redis, and RabbitMQ checks.
   */
  @Get('ready')
  @HealthCheck()
  ready() {
    return this.health.check([]);
  }
}
