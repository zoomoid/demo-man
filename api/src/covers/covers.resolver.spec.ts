import { Test, TestingModule } from '@nestjs/testing';
import { CoversResolver } from './covers.resolver';
import { CoversService } from './covers.service';

describe('CoversResolver', () => {
  let resolver: CoversResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoversResolver, CoversService],
    }).compile();

    resolver = module.get<CoversResolver>(CoversResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
