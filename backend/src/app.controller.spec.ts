import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let dataSource: jest.Mocked<Partial<DataSource>>;

  beforeEach(async () => {
    dataSource = {
      isInitialized: true,
      query: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
  });

  describe('root', () => {
    it('returns "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('health', () => {
    it('returns healthy status when database is connected', async () => {
      const result = await appController.checkHealth();

      expect(result).toEqual({
        status: 'ok',
        message: 'Backend connected successfully',
        database: 'connected',
      });
    });

    it('returns error status when database fails', async () => {
      (dataSource.query as jest.Mock).mockRejectedValueOnce(
        new Error('DB error'),
      );

      const result = await appController.checkHealth();

      expect(result).toEqual({
        status: 'error',
        message: 'Backend is running but database is unavailable',
        database: 'disconnected',
      });
    });
  });
});
