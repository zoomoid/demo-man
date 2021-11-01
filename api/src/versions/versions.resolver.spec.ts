import { Test, TestingModule } from '@nestjs/testing';
import { VersionsResolver } from './versions.resolver';
import { VersionsService } from './versions.service';

describe('VersionsResolver', () => {
  let resolver: VersionsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VersionsResolver, VersionsService],
    }).compile();

    resolver = module.get<VersionsResolver>(VersionsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
