import { Test, TestingModule } from '@nestjs/testing';
import { TracksResolver } from './tracks.resolver';
import { TracksService } from './tracks.service';

describe('TracksResolver', () => {
  let resolver: TracksResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TracksResolver, TracksService],
    }).compile();

    resolver = module.get<TracksResolver>(TracksResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
