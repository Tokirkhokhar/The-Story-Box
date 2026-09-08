import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

export interface HealthResponse {
  status: 'ok' | 'error';
  message: string;
  database: 'connected' | 'disconnected';
}

@Injectable()
export class AppService {
  constructor(private readonly dataSource: DataSource) {}

  getHello(): string {
    return 'Hello World!';
  }

  async checkHealth(): Promise<HealthResponse> {
    try {
      if (!this.dataSource.isInitialized) {
        throw new Error('Database is not initialized');
      }
      await this.dataSource.query('SELECT 1');
      return {
        status: 'ok',
        message: 'Backend connected successfully',
        database: 'connected',
      };
    } catch {
      return {
        status: 'error',
        message: 'Backend is running but database is unavailable',
        database: 'disconnected',
      };
    }
  }
}
