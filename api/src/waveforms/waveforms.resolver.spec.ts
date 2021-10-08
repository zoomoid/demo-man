import { Test, TestingModule } from '@nestjs/testing';
import { WaveformsResolver } from './waveforms.resolver';
import { WaveformsService } from './waveforms.service';

describe('WaveformsResolver', () => {
  let resolver: WaveformsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WaveformsResolver, WaveformsService],
    }).compile();

    resolver = module.get<WaveformsResolver>(WaveformsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
