import { Test, TestingModule } from '@nestjs/testing';
import { WaveformsService } from './waveforms.service';

describe('WaveformsService', () => {
  let service: WaveformsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WaveformsService],
    }).compile();

    service = module.get<WaveformsService>(WaveformsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
