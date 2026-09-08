import { ULID } from '@thi.ng/ksuid';
import { DataSource, QueryRunner } from 'typeorm';

export const generateKSUID = async (prefix: string): Promise<string> => {
  const ksuid = new ULID();
  return `${prefix}_${ksuid.next()}`;
};

export const startTransaction = async (
  dataSource: DataSource,
): Promise<QueryRunner> => {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  return queryRunner;
};
