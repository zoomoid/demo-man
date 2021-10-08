import { Module } from '@nestjs/common';
import { WaveformsService } from './waveforms.service';
import { WaveformsResolver } from './waveforms.resolver';

@Module({
  providers: [WaveformsResolver, WaveformsService],
})
export class WaveformsModule {}
