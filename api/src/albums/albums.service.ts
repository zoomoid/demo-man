import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAlbumInput } from './dto/create-album.input';
import { UpdateAlbumInput } from './dto/update-album.input';
import { Album } from './entities/album.entity';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Album) private albumRepository: Repository<Album>,
  ) {}

  async create(createAlbumInput: CreateAlbumInput) {
    return this.albumRepository.create(createAlbumInput);
  }

  async findAll() {
    return this.albumRepository.find();
  }

  async findOne(id: number) {
    return this.albumRepository.findOne(id);
  }

  async update(id: number, updateAlbumInput: UpdateAlbumInput) {
    return this.albumRepository.update(id, updateAlbumInput);
  }

  async remove(id: number) {
    return this.albumRepository.delete(id);
  }
}
