import { Test, TestingModule } from '@nestjs/testing';
import { LimiterService } from './limiter.service';
import { REDIS_CLIENT } from 'src/redis/redis.module';
import { Rule } from 'src/common/entities/rule.entity';
import { IdentifierType } from 'src/common/enums/identifier-type.enum';
import { RuleStatus } from 'src/common/enums/rule-status.enum';

const mockPipelineExec = jest.fn().mockResolvedValue([
  [null, 0],
  [null, 3],
  [null, 1],
  [null, 1],
]);

const mockRedis = {
  pipeline: jest.fn().mockReturnValue({
    zremrangebyscore: jest.fn().mockReturnThis(),
    zcard: jest.fn().mockReturnThis(),
    zadd: jest.fn().mockReturnThis(),
    expire: jest.fn().mockReturnThis(),
    exec: mockPipelineExec,
  }),
  zrange: jest.fn().mockResolvedValue(['member', String(Date.now() - 10000)]),
  zremrangebyscore: jest.fn().mockResolvedValue(1),
};

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

describe('LimiterService', () => {
  let service: LimiterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LimiterService,
        {
          provide: REDIS_CLIENT,
          useValue: mockRedis,
        },
      ],
    }).compile();

    service = module.get<LimiterService>(LimiterService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should allow request when under limit', async () => {
    const result = await service.check(mockRule, '192.168.1.1');

    expect(result.allowed).toBe(true);
    expect(result.limit).toBe(5);
    expect(result.remaining).toBe(1); // 5 - 3 - 1 = 1
  });

  it('should block request when at limit', async () => {
    mockPipelineExec.mockResolvedValueOnce([
      [null, 0],
      [null, 5],
      [null, 1],
      [null, 1],
    ]);

    const result = await service.check(mockRule, '192.168.1.1');

    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.retryAfter).toBeDefined();
  });
});
