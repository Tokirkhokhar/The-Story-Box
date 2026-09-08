import { Test, TestingModule } from '@nestjs/testing';
import { BookAuthorsController } from './book-authors.controller';
import { BookAuthorsService } from './book-authors.service';
import { CreateBookAuthorDto } from './dto/create-book-author.dto';
import { UpdateBookAuthorDto } from './dto/update-book-author.dto';
import { BookAuthor } from './entities/book-author.entity';
import { AuthorRole } from '../../enums';

describe('BookAuthorsController', () => {
  let controller: BookAuthorsController;
  let service: jest.Mocked<BookAuthorsService>;

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
      controllers: [BookAuthorsController],
      providers: [
        {
          provide: BookAuthorsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            findByBookId: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BookAuthorsController>(BookAuthorsController);
    service = module.get(BookAuthorsService);
  });

  describe('create', () => {
    it('delegates creation to BookAuthorsService', async () => {
      const dto: CreateBookAuthorDto = {
        bookId: 'bk_1234567890',
        authorId: 'au_1234567890',
      };
      service.create.mockResolvedValue(mockBookAuthor);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockBookAuthor);
    });
  });

  describe('findAll', () => {
    it('returns all relations when bookId query param is omitted', async () => {
      service.findAll.mockResolvedValue([mockBookAuthor]);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockBookAuthor]);
    });

    it('filters by bookId when bookId query param is provided', async () => {
      service.findByBookId.mockResolvedValue([mockBookAuthor]);

      const result = await controller.findAll('bk_1234567890');

      expect(service.findByBookId).toHaveBeenCalledWith('bk_1234567890');
      expect(result).toEqual([mockBookAuthor]);
    });
  });

  describe('findOne', () => {
    it('returns a single book-author relation from service', async () => {
      service.findOne.mockResolvedValue(mockBookAuthor);

      const result = await controller.findOne('bkau_1234567890');

      expect(service.findOne).toHaveBeenCalledWith('bkau_1234567890');
      expect(result).toEqual(mockBookAuthor);
    });
  });

  describe('update', () => {
    it('delegates update to BookAuthorsService', async () => {
      const dto: UpdateBookAuthorDto = { displayOrder: 2 };
      const updatedRecord = { ...mockBookAuthor, displayOrder: 2 };
      service.update.mockResolvedValue(updatedRecord as BookAuthor);

      const result = await controller.update('bkau_1234567890', dto);

      expect(service.update).toHaveBeenCalledWith('bkau_1234567890', dto);
      expect(result).toEqual(updatedRecord);
    });
  });

  describe('remove', () => {
    it('delegates removal to BookAuthorsService', async () => {
      service.remove.mockResolvedValue(undefined);

      await controller.remove('bkau_1234567890');

      expect(service.remove).toHaveBeenCalledWith('bkau_1234567890');
    });
  });
});
