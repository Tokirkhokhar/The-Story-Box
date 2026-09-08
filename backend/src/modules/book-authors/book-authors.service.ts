import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookAuthorDto } from './dto/create-book-author.dto';
import { UpdateBookAuthorDto } from './dto/update-book-author.dto';
import { BookAuthor } from './entities/book-author.entity';

@Injectable()
export class BookAuthorsService {
  constructor(
    @InjectRepository(BookAuthor)
    private readonly bookAuthorRepository: Repository<BookAuthor>,
  ) {}

  async create(createBookAuthorDto: CreateBookAuthorDto): Promise<BookAuthor> {
    const bookAuthor = this.bookAuthorRepository.create(createBookAuthorDto);
    return await this.bookAuthorRepository.save(bookAuthor);
  }

  async findAll(): Promise<BookAuthor[]> {
    return await this.bookAuthorRepository.find({
      relations: {
        book: true,
        author: true,
      },
    });
  }

  async findOne(id: string): Promise<BookAuthor> {
    const bookAuthor = await this.bookAuthorRepository.findOne({
      where: { id },
      relations: {
        book: true,
        author: true,
      },
    });
    if (!bookAuthor) {
      throw new NotFoundException(`BookAuthor with ID ${id} not found`);
    }
    return bookAuthor;
  }

  async findByBookId(bookId: string): Promise<BookAuthor[]> {
    return await this.bookAuthorRepository.find({
      where: { bookId },
      relations: {
        author: true,
      },
      order: { displayOrder: 'ASC' },
    });
  }

  async update(id: string, updateBookAuthorDto: UpdateBookAuthorDto): Promise<BookAuthor> {
    const bookAuthor = await this.findOne(id);
    Object.assign(bookAuthor, updateBookAuthorDto);
    return await this.bookAuthorRepository.save(bookAuthor);
  }

  async remove(id: string): Promise<void> {
    const bookAuthor = await this.findOne(id);
    await this.bookAuthorRepository.remove(bookAuthor);
  }
}
