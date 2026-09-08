import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { PublishingStatus } from '../../enums';

describe('BooksController', () => {
  let controller: BooksController;
  let service: jest.Mocked<BooksService>;

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
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    service = module.get(BooksService);
  });

  describe('create', () => {
    it('delegates creation to BooksService', async () => {
      const dto: CreateBookDto = {
        title: 'Harry Potter',
        slug: 'harry-potter',
      };
      service.create.mockResolvedValue(mockBook);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockBook);
    });
  });

  describe('findAll', () => {
    it('returns array of books from service', async () => {
      service.findAll.mockResolvedValue([mockBook]);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockBook]);
    });
  });

  describe('findOne', () => {
    it('returns a single book from service', async () => {
      service.findOne.mockResolvedValue(mockBook);

      const result = await controller.findOne('bk_1234567890');

      expect(service.findOne).toHaveBeenCalledWith('bk_1234567890');
      expect(result).toEqual(mockBook);
    });
  });

  describe('update', () => {
    it('delegates update to BooksService', async () => {
      const dto: UpdateBookDto = { title: 'Updated Title' };
      const updatedBook = { ...mockBook, title: 'Updated Title' };
      service.update.mockResolvedValue(updatedBook as Book);

      const result = await controller.update('bk_1234567890', dto);

      expect(service.update).toHaveBeenCalledWith('bk_1234567890', dto);
      expect(result).toEqual(updatedBook);
    });
  });

  describe('remove', () => {
    it('delegates removal to BooksService', async () => {
      service.remove.mockResolvedValue(undefined);

      await controller.remove('bk_1234567890');

      expect(service.remove).toHaveBeenCalledWith('bk_1234567890');
    });
  });
});
