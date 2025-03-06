import { Test, TestingModule } from '@nestjs/testing';
import { ObtainedBadgesService } from './obtained-badges.service';

describe('ObtainedBadgesService', () => {
  let service: ObtainedBadgesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ObtainedBadgesService],
    }).compile();

    service = module.get<ObtainedBadgesService>(ObtainedBadgesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
