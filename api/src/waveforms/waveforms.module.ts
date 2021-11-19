import { Module } from '@nestjs/common';
import { WaveformsService } from './waveforms.service';
import { WaveformsResolver } from './waveforms.resolver';
import { Waveform } from './entities/waveform.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Version } from '../versions/entities/version.entity';

@Module({
  providers: [WaveformsResolver, WaveformsService],
  imports: [TypeOrmModule.forFeature([Waveform, Version])],
})
export class WaveformsModule {}
