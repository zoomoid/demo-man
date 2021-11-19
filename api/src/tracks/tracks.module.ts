import { Module } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { TracksResolver } from './tracks.resolver';
import { Track } from './entities/track.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [TracksResolver, TracksService],
  imports: [TypeOrmModule.forFeature([Track])],
})
export class TracksModule {}
