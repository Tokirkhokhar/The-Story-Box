import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

export interface HealthResponse {
  status: 'ok' | 'error';
  message: string;
  database: 'connected' | 'disconnected';
}

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly dataSource: DataSource) { }

  getHello(): string {
    return 'Hello World!';
  }

  async checkHealth(): Promise<HealthResponse> {
    this.logger.log('Health check request received');

    try {
      if (!this.dataSource.isInitialized) {
        throw new Error('Database is not initialized');
      }
      await this.dataSource.query('SELECT 1');
      this.logger.log('Health check succeeded - Database connected');
      return {
        status: 'ok',
        message: 'Backend connected successfully',
        database: 'connected',
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.warn(`Health check failed - Database unavailable: ${errorMessage}`);
      return {
        status: 'error',
        message: 'Backend is running but database is unavailable',
        database: 'disconnected',
      };
    }
  }
}
