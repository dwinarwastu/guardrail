import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { RuleService } from './rule.service';
import { Rule } from 'src/common/entities/rule.entity';
import { IdentifierType } from 'src/common/enums/identifier-type.enum';
import { RuleStatus } from 'src/common/enums/rule-status.enum';
import { CreateRuleDto } from './dto/create-rule.dto';

const mockRule: Rule = {
  id: 'rule-uuid',
  resource: '/api/login',
  identifierType: IdentifierType.IP,
  limit: 5,
  windowSizeSeconds: 60,
  status: RuleStatus.ACTIVE,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockRepository = {
  create: jest.fn().mockReturnValue(mockRule),
  save: jest.fn().mockResolvedValue(mockRule),
  find: jest.fn().mockResolvedValue([mockRule]),
  findOne: jest.fn().mockResolvedValue(mockRule),
  remove: jest.fn().mockResolvedValue(mockRule),
};

describe('RuleService', () => {
  let service: RuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RuleService,
        {
          provide: getRepositoryToken(Rule),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<RuleService>(RuleService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a rule', async () => {
      const dto: CreateRuleDto = {
        resource: '/api/login',
        identifierType: IdentifierType.IP,
        limit: 5,
        windowSizeSeconds: 60,
      };

      const result = await service.create(dto);
      expect(result.resource).toBe('/api/login');
      expect(result.limit).toBe(5);
    });
  });

  describe('findAll', () => {
    it('should return all rules', async () => {
      const result = await service.findAll();
      expect(result).toHaveLength(1);
    });
  });

  describe('findActiveByResource', () => {
    it('should return active rule', async () => {
      const result = await service.findActiveByResource(
        '/api/login',
        IdentifierType.IP,
      );
      expect(result).toBeDefined();
      expect(result?.status).toBe(RuleStatus.ACTIVE);
    });

    it('should return null when rule not found', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);
      const result = await service.findActiveByResource(
        '/not-exist',
        IdentifierType.IP,
      );
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should remove a rule', async () => {
      await expect(service.remove('rule-uuid')).resolves.not.toThrow();
    });

    it('should throw NotFoundException when rule not found', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.remove('not-exist')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('toggleStatus', () => {
    it('should toggle rule status to inactive', async () => {
      mockRepository.save.mockResolvedValueOnce({
        ...mockRule,
        status: RuleStatus.INACTIVE,
      });

      const result = await service.toggleStatus('rule-uuid');
      expect(result.status).toBe(RuleStatus.INACTIVE);
    });
  });
});
