import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { ImportStatus, PublishingStatus } from '../../../enums';
import { BookAuthor } from '../../book-authors/entities/book-author.entity';
import { Publisher } from '../../publishers/entities/publisher.entity';

@Entity('books')
export class Book extends BaseEntity {
  protected idPrefix = 'bk';

  @Column({ type: 'varchar', length: 500 })
  title: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  subtitle?: string;

  @Column({ type: 'varchar', length: 600, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  shortDescription?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  isbn10?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  isbn13?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  edition?: string;

  @Column({ type: 'date', nullable: true })
  publicationDate?: Date;

  @Column({ type: 'integer', nullable: true })
  pages?: number;

  @Column({ type: 'varchar', nullable: true })
  publisherId?: string;

  @Column({ type: 'varchar', nullable: true })
  languageId?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  source?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  sourceBookId?: string;

  @Column({ type: 'text', nullable: true })
  sourceUrl?: string;

  @Column({ type: 'timestamp', nullable: true })
  importedAt?: Date;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  importStatus?: ImportStatus;

  @Column({
    type: 'varchar',
    default: PublishingStatus.DRAFT,
  })
  status: PublishingStatus;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, unknown>;

  @ManyToOne(() => Publisher, (publisher) => publisher.books, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'publisherId' })
  publisher?: Publisher;

  @OneToMany(() => BookAuthor, (bookAuthor) => bookAuthor.book)
  bookAuthors?: BookAuthor[];
}
