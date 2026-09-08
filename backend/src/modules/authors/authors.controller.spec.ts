import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsController } from './authors.controller';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Author } from './entities/author.entity';
import { PublishingStatus } from '../../enums';

describe('AuthorsController', () => {
  let controller: AuthorsController;
  let service: jest.Mocked<AuthorsService>;

  const mockAuthor: Author = Object.assign(new Author(), {
    id: 'au_1234567890',
    fullName: 'J.K. Rowling',
    slug: 'jk-rowling',
    biography: 'Author of Harry Potter',
    status: PublishingStatus.PUBLISHED,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorsController],
      providers: [
        {
          provide: AuthorsService,
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

    controller = module.get<AuthorsController>(AuthorsController);
    service = module.get(AuthorsService);
  });

  describe('create', () => {
    it('delegates creation to AuthorsService', async () => {
      const dto: CreateAuthorDto = {
        fullName: 'J.K. Rowling',
        slug: 'jk-rowling',
      };
      service.create.mockResolvedValue(mockAuthor);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockAuthor);
    });
  });

  describe('findAll', () => {
    it('returns array of authors from service', async () => {
      service.findAll.mockResolvedValue([mockAuthor]);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockAuthor]);
    });
  });

  describe('findOne', () => {
    it('returns a single author from service', async () => {
      service.findOne.mockResolvedValue(mockAuthor);

      const result = await controller.findOne('au_1234567890');

      expect(service.findOne).toHaveBeenCalledWith('au_1234567890');
      expect(result).toEqual(mockAuthor);
    });
  });

  describe('update', () => {
    it('delegates update to AuthorsService', async () => {
      const dto: UpdateAuthorDto = { fullName: 'Updated Name' };
      const updatedAuthor = { ...mockAuthor, fullName: 'Updated Name' };
      service.update.mockResolvedValue(updatedAuthor as Author);

      const result = await controller.update('au_1234567890', dto);

      expect(service.update).toHaveBeenCalledWith('au_1234567890', dto);
      expect(result).toEqual(updatedAuthor);
    });
  });

  describe('remove', () => {
    it('delegates removal to AuthorsService', async () => {
      service.remove.mockResolvedValue(undefined);

      await controller.remove('au_1234567890');

      expect(service.remove).toHaveBeenCalledWith('au_1234567890');
    });
  });
});
