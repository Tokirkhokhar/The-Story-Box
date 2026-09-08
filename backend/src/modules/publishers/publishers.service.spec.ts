import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { Publisher } from './entities/publisher.entity';
import { PublishersService } from './publishers.service';
import { PublishingStatus } from '../../enums';

describe('PublishersService', () => {
  let service: PublishersService;
  let repository: jest.Mocked<Repository<Publisher>>;

  const mockPublisher: Publisher = Object.assign(new Publisher(), {
    id: 'pub_1234567890',
    name: 'Penguin Books',
    slug: 'penguin-books',
    status: PublishingStatus.PUBLISHED,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublishersService,
        {
          provide: getRepositoryToken(Publisher),
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

    service = module.get<PublishersService>(PublishersService);
    repository = module.get(getRepositoryToken(Publisher));
  });

  describe('create', () => {
    it('creates and saves a new publisher', async () => {
      const dto: CreatePublisherDto = {
        name: 'Penguin Books',
        slug: 'penguin-books',
      };

      repository.create.mockReturnValue(mockPublisher);
      repository.save.mockResolvedValue(mockPublisher);

      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledWith(mockPublisher);
      expect(result).toEqual(mockPublisher);
    });
  });

  describe('findAll', () => {
    it('returns an array of publishers', async () => {
      repository.find.mockResolvedValue([mockPublisher]);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual([mockPublisher]);
    });
  });

  describe('findOne', () => {
    it('returns a publisher when found', async () => {
      repository.findOne.mockResolvedValue(mockPublisher);

      const result = await service.findOne('pub_1234567890');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'pub_1234567890' },
      });
      expect(result).toEqual(mockPublisher);
    });

    it('throws NotFoundException when publisher does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid_id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('updates and returns the publisher', async () => {
      const dto: UpdatePublisherDto = { name: 'Updated Publisher' };
      const updatedPublisher = { ...mockPublisher, name: 'Updated Publisher' };

      repository.findOne.mockResolvedValue(mockPublisher);
      repository.save.mockResolvedValue(updatedPublisher as Publisher);

      const result = await service.update('pub_1234567890', dto);

      expect(repository.save).toHaveBeenCalled();
      expect(result.name).toBe('Updated Publisher');
    });
  });

  describe('remove', () => {
    it('removes the publisher when found', async () => {
      repository.findOne.mockResolvedValue(mockPublisher);
      repository.remove.mockResolvedValue(mockPublisher);

      await service.remove('pub_1234567890');

      expect(repository.remove).toHaveBeenCalledWith(mockPublisher);
    });
  });
});
