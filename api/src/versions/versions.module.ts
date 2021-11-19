import { Module } from '@nestjs/common';
import { VersionsService } from './versions.service';
import { VersionsResolver } from './versions.resolver';
import { Version } from './entities/version.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [VersionsResolver, VersionsService],
  imports: [TypeOrmModule.forFeature([Version])],
})
export class VersionsModule {}
