import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { PublishingStatus } from '../../../enums';
import { BookAuthor } from '../../book-authors/entities/book-author.entity';

@Entity('authors')
export class Author extends BaseEntity {
  protected idPrefix = 'au';

  @Column({ type: 'varchar', length: 255 })
  fullName: string;

  @Column({ type: 'varchar', length: 300, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  biography?: string;

  @Column({ type: 'date', nullable: true })
  birthDate?: Date;

  @Column({ type: 'date', nullable: true })
  deathDate?: Date;

  @Column({ type: 'text', nullable: true })
  profileImage?: string;

  @Column({ type: 'text', nullable: true })
  website?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nationality?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  gender?: string;

  @Column({ type: 'text', nullable: true })
  awards?: string;

  @Column({ type: 'jsonb', nullable: true })
  socialLinks?: Record<string, unknown>;

  @Column({ type: 'varchar', length: 100, nullable: true })
  source?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  sourceAuthorId?: string;

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

  @OneToMany(() => BookAuthor, (bookAuthor) => bookAuthor.author)
  bookAuthors?: BookAuthor[];
}
