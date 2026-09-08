import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { PublishingStatus } from '../../enums';

describe('BooksService', () => {
  let service: BooksService;
  let repository: jest.Mocked<Repository<Book>>;

  const mockBook: Book = Object.assign(new Book(), {
    id: 'bk_1234567890',
    title: 'Harry Potter',
    slug: 'harry-potter',
    status: PublishingStatus.DRAFT,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(Book),
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

    service = module.get<BooksService>(BooksService);
    repository = module.get(getRepositoryToken(Book));
  });

  describe('create', () => {
    it('creates and saves a new book', async () => {
      const dto: CreateBookDto = {
        title: 'Harry Potter',
        slug: 'harry-potter',
      };

      repository.create.mockReturnValue(mockBook);
      repository.save.mockResolvedValue(mockBook);

      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledWith(mockBook);
      expect(result).toEqual(mockBook);
    });
  });

  describe('findAll', () => {
    it('returns array of books with relations loaded', async () => {
      repository.find.mockResolvedValue([mockBook]);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledWith({
        relations: {
          publisher: true,
          bookAuthors: {
            author: true,
          },
        },
      });
      expect(result).toEqual([mockBook]);
    });
  });

  describe('findOne', () => {
    it('returns a book when found', async () => {
      repository.findOne.mockResolvedValue(mockBook);

      const result = await service.findOne('bk_1234567890');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'bk_1234567890' },
        relations: {
          publisher: true,
          bookAuthors: {
            author: true,
          },
        },
      });
      expect(result).toEqual(mockBook);
    });

    it('throws NotFoundException when book does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid_id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('updates and returns the book', async () => {
      const dto: UpdateBookDto = { title: 'Updated Title' };
      const updatedBook = { ...mockBook, title: 'Updated Title' };

      repository.findOne.mockResolvedValue(mockBook);
      repository.save.mockResolvedValue(updatedBook as Book);

      const result = await service.update('bk_1234567890', dto);

      expect(repository.save).toHaveBeenCalled();
      expect(result.title).toBe('Updated Title');
    });
  });

  describe('remove', () => {
    it('removes the book when found', async () => {
      repository.findOne.mockResolvedValue(mockBook);
      repository.remove.mockResolvedValue(mockBook);

      await service.remove('bk_1234567890');

      expect(repository.remove).toHaveBeenCalledWith(mockBook);
    });
  });
});
