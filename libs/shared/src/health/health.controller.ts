import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
} from '@nestjs/terminus';

// This controller gives every service basic health endpoints.
// Kubernetes will later use liveness/readiness endpoints for probes.
@Controller()
export class HealthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly healthCheckService: HealthCheckService,
    private readonly memoryHealthIndicator: MemoryHealthIndicator,
    private readonly diskHealthIndicator: DiskHealthIndicator,
  ) {}

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: this.configService.get<string>('SERVICE_NAME'),
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health/live')
  getLiveness() {
    return {
      status: 'ok',
      service: this.configService.get<string>('SERVICE_NAME'),
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health/ready')
  @HealthCheck()
  getReadiness() {
    return this.healthCheckService.check([
      // Check that the Node.js heap is not using too much memory.
      // This is a simple local readiness check before we add database/broker checks later.
      () =>
        this.memoryHealthIndicator.checkHeap('memory_heap', 150 * 1024 * 1024),

      // Check that the current working directory still has free disk space.
      // This helps catch full-disk issues in local containers or future pods.
      () =>
        this.diskHealthIndicator.checkStorage('disk', {
          path: process.cwd(),
          thresholdPercent: 0.9,
        }),
    ]);
  }
}
