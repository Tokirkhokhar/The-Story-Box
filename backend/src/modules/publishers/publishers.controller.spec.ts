import { Test, TestingModule } from '@nestjs/testing';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { Publisher } from './entities/publisher.entity';
import { PublishersController } from './publishers.controller';
import { PublishersService } from './publishers.service';
import { PublishingStatus } from '../../enums';

describe('PublishersController', () => {
  let controller: PublishersController;
  let service: jest.Mocked<PublishersService>;

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
      controllers: [PublishersController],
      providers: [
        {
          provide: PublishersService,
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

    controller = module.get<PublishersController>(PublishersController);
    service = module.get(PublishersService);
  });

  describe('create', () => {
    it('delegates creation to PublishersService', async () => {
      const dto: CreatePublisherDto = {
        name: 'Penguin Books',
        slug: 'penguin-books',
      };
      service.create.mockResolvedValue(mockPublisher);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockPublisher);
    });
  });

  describe('findAll', () => {
    it('returns array of publishers from service', async () => {
      service.findAll.mockResolvedValue([mockPublisher]);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockPublisher]);
    });
  });

  describe('findOne', () => {
    it('returns a single publisher from service', async () => {
      service.findOne.mockResolvedValue(mockPublisher);

      const result = await controller.findOne('pub_1234567890');

      expect(service.findOne).toHaveBeenCalledWith('pub_1234567890');
      expect(result).toEqual(mockPublisher);
    });
  });

  describe('update', () => {
    it('delegates update to PublishersService', async () => {
      const dto: UpdatePublisherDto = { name: 'Updated Publisher' };
      const updatedPublisher = { ...mockPublisher, name: 'Updated Publisher' };
      service.update.mockResolvedValue(updatedPublisher as Publisher);

      const result = await controller.update('pub_1234567890', dto);

      expect(service.update).toHaveBeenCalledWith('pub_1234567890', dto);
      expect(result).toEqual(updatedPublisher);
    });
  });

  describe('remove', () => {
    it('delegates removal to PublishersService', async () => {
      service.remove.mockResolvedValue(undefined);

      await controller.remove('pub_1234567890');

      expect(service.remove).toHaveBeenCalledWith('pub_1234567890');
    });
  });
});
