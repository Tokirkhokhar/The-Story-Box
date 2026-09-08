import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Author } from './entities/author.entity';
import { PublishingStatus } from '../../enums';

describe('AuthorsService', () => {
  let service: AuthorsService;
  let repository: jest.Mocked<Repository<Author>>;

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
      providers: [
        AuthorsService,
        {
          provide: getRepositoryToken(Author),
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

    service = module.get<AuthorsService>(AuthorsService);
    repository = module.get(getRepositoryToken(Author));
  });

  describe('create', () => {
    it('creates and saves a new author', async () => {
      const dto: CreateAuthorDto = {
        fullName: 'J.K. Rowling',
        slug: 'jk-rowling',
      };

      repository.create.mockReturnValue(mockAuthor);
      repository.save.mockResolvedValue(mockAuthor);

      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledWith(mockAuthor);
      expect(result).toEqual(mockAuthor);
    });
  });

  describe('findAll', () => {
    it('returns an array of authors', async () => {
      repository.find.mockResolvedValue([mockAuthor]);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual([mockAuthor]);
    });
  });

  describe('findOne', () => {
    it('returns an author when found', async () => {
      repository.findOne.mockResolvedValue(mockAuthor);

      const result = await service.findOne('au_1234567890');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'au_1234567890' },
      });
      expect(result).toEqual(mockAuthor);
    });

    it('throws NotFoundException when author does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid_id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('updates and returns the author', async () => {
      const dto: UpdateAuthorDto = { fullName: 'Updated Name' };
      const updatedAuthor = { ...mockAuthor, fullName: 'Updated Name' };

      repository.findOne.mockResolvedValue(mockAuthor);
      repository.save.mockResolvedValue(updatedAuthor as Author);

      const result = await service.update('au_1234567890', dto);

      expect(repository.save).toHaveBeenCalled();
      expect(result.fullName).toBe('Updated Name');
    });
  });

  describe('remove', () => {
    it('removes the author when found', async () => {
      repository.findOne.mockResolvedValue(mockAuthor);
      repository.remove.mockResolvedValue(mockAuthor);

      await service.remove('au_1234567890');

      expect(repository.remove).toHaveBeenCalledWith(mockAuthor);
    });
  });
});
