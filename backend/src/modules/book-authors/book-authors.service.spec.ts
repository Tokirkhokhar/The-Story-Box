import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookAuthorsService } from './book-authors.service';
import { CreateBookAuthorDto } from './dto/create-book-author.dto';
import { UpdateBookAuthorDto } from './dto/update-book-author.dto';
import { BookAuthor } from './entities/book-author.entity';
import { AuthorRole } from '../../enums';

describe('BookAuthorsService', () => {
  let service: BookAuthorsService;
  let repository: jest.Mocked<Repository<BookAuthor>>;

  const mockBookAuthor: BookAuthor = Object.assign(new BookAuthor(), {
    id: 'bkau_1234567890',
    bookId: 'bk_1234567890',
    authorId: 'au_1234567890',
    role: AuthorRole.AUTHOR,
    displayOrder: 1,
    book: null as any,
    author: null as any,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookAuthorsService,
        {
          provide: getRepositoryToken(BookAuthor),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BookAuthorsService>(BookAuthorsService);
    repository = module.get(getRepositoryToken(BookAuthor));
  });

  describe('create', () => {
    it('creates and saves a new book-author relation', async () => {
      const dto: CreateBookAuthorDto = {
        bookId: 'bk_1234567890',
        authorId: 'au_1234567890',
        role: AuthorRole.AUTHOR,
      };

      repository.create.mockReturnValue(mockBookAuthor);
      repository.save.mockResolvedValue(mockBookAuthor);

      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledWith(mockBookAuthor);
      expect(result).toEqual(mockBookAuthor);
    });
  });

  describe('findAll', () => {
    it('returns array of book-authors with book and author relations', async () => {
      repository.find.mockResolvedValue([mockBookAuthor]);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledWith({
        relations: {
          book: true,
          author: true,
        },
      });
      expect(result).toEqual([mockBookAuthor]);
    });
  });

  describe('findOne', () => {
    it('returns book-author when found', async () => {
      repository.findOne.mockResolvedValue(mockBookAuthor);

      const result = await service.findOne('bkau_1234567890');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'bkau_1234567890' },
        relations: {
          book: true,
          author: true,
        },
      });
      expect(result).toEqual(mockBookAuthor);
    });

    it('throws NotFoundException when record does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid_id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByBookId', () => {
    it('returns relations for specific bookId ordered by displayOrder', async () => {
      repository.find.mockResolvedValue([mockBookAuthor]);

      const result = await service.findByBookId('bk_1234567890');

      expect(repository.find).toHaveBeenCalledWith({
        where: { bookId: 'bk_1234567890' },
        relations: {
          author: true,
        },
        order: { displayOrder: 'ASC' },
      });
      expect(result).toEqual([mockBookAuthor]);
    });
  });

  describe('update', () => {
    it('updates and returns the book-author relation', async () => {
      const dto: UpdateBookAuthorDto = { displayOrder: 2 };
      const updatedRecord = { ...mockBookAuthor, displayOrder: 2 };

      repository.findOne.mockResolvedValue(mockBookAuthor);
      repository.save.mockResolvedValue(updatedRecord as BookAuthor);

      const result = await service.update('bkau_1234567890', dto);

      expect(repository.save).toHaveBeenCalled();
      expect(result.displayOrder).toBe(2);
    });
  });

  describe('remove', () => {
    it('removes the book-author record when found', async () => {
      repository.findOne.mockResolvedValue(mockBookAuthor);
      repository.remove.mockResolvedValue(mockBookAuthor);

      await service.remove('bkau_1234567890');

      expect(repository.remove).toHaveBeenCalledWith(mockBookAuthor);
    });
  });
});
