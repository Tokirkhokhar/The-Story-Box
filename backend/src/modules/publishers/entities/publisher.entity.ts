import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { PublishingStatus } from '../../../enums';
import { Book } from '../../books/entities/book.entity';

@Entity('publishers')
export class Publisher extends BaseEntity {
  protected idPrefix = 'pub';

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 300, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  logo?: string;

  @Column({ type: 'text', nullable: true })
  website?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone?: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  country?: string;

  @Column({ type: 'integer', nullable: true })
  foundedYear?: number;

  @Column({ type: 'varchar', length: 30, nullable: true })
  publisherType?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  source?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  sourcePublisherId?: string;

  @Column({ type: 'text', nullable: true })
  sourceUrl?: string;

  @Column({ type: 'timestamp', nullable: true })
  importedAt?: Date;

  @Column({
    type: 'varchar',
    default: PublishingStatus.PUBLISHED,
  })
  status: PublishingStatus;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, unknown>;

  @OneToMany(() => Book, (book) => book.publisher)
  books?: Book[];
}
