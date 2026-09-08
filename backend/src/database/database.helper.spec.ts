import { DataSource, QueryRunner } from 'typeorm';
import { generateKSUID, startTransaction } from './database.helper';

describe('database.helper', () => {
  describe('generateKSUID', () => {
    it('generates a string formatted with prefix and ULID', async () => {
      const result = await generateKSUID('test');

      expect(result).toMatch(/^test_/);
      expect(typeof result).toBe('string');
    });
  });

  describe('startTransaction', () => {
    it('connects and starts transaction on queryRunner', async () => {
      const mockQueryRunner = {
        connect: jest.fn().mockResolvedValue(undefined),
        startTransaction: jest.fn().mockResolvedValue(undefined),
      } as unknown as QueryRunner;

      const mockDataSource = {
        createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
      } as unknown as DataSource;

      const runner = await startTransaction(mockDataSource);

      expect(mockDataSource.createQueryRunner).toHaveBeenCalled();
      expect(mockQueryRunner.connect).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(runner).toBe(mockQueryRunner);
    });
  });
});
