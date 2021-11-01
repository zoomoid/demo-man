import { Module } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { TracksResolver } from './tracks.resolver';

@Module({
  providers: [TracksResolver, TracksService]
})
export class TracksModule {}
