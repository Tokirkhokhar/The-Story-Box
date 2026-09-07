import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';

@Entity('books')
export class Book extends BaseEntity {
  protected idPrefix = 'book';

  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ nullable: true })
  description?: string;
}
