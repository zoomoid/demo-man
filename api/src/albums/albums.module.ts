import { Module } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { AlbumsResolver } from './albums.resolver';
import { Album } from './entities/album.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [AlbumsResolver, AlbumsService],
  imports: [TypeOrmModule.forFeature([Album])],
})
export class AlbumsModule {}
