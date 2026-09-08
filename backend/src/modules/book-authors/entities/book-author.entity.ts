import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { AuthorRole } from '../../../enums';
import { Author } from '../../authors/entities/author.entity';
import { Book } from '../../books/entities/book.entity';

@Entity('book_authors')
@Unique(['bookId', 'authorId', 'role'])
export class BookAuthor extends BaseEntity {
  protected idPrefix = 'bkau';

  @Column({ type: 'varchar' })
  bookId: string;

  @Column({ type: 'varchar' })
  authorId: string;

  @Column({
    type: 'varchar',
    default: AuthorRole.AUTHOR,
  })
  role: AuthorRole;

  @Column({ type: 'integer', default: 1 })
  displayOrder: number;

  @ManyToOne(() => Book, (book) => book.bookAuthors, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookId' })
  book: Book;

  @ManyToOne(() => Author, (author) => author.bookAuthors, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'authorId' })
  author: Author;
}
