import { Module } from '@nestjs/common';
import { VersionsService } from './versions.service';
import { VersionsResolver } from './versions.resolver';

@Module({
  providers: [VersionsResolver, VersionsService]
})
export class VersionsModule {}
