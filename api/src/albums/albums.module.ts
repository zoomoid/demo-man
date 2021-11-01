import { Module } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { AlbumsResolver } from './albums.resolver';

@Module({
  providers: [AlbumsResolver, AlbumsService]
})
export class AlbumsModule {}
