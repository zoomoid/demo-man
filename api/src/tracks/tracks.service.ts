import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTrackInput } from './dto/create-track.input';
import { UpdateTrackInput } from './dto/update-track.input';
import { Track } from './entities/track.entity';

@Injectable()
export class TracksService {
  constructor(
    @InjectRepository(Track) private trackRepository: Repository<Track>,
  ) {}

  async create(createTrackInput: CreateTrackInput) {
    return this.trackRepository.create(createTrackInput);
  }

  async findAll() {
    return this.trackRepository.find();
  }

  async findOne(id: number) {
    return this.trackRepository.findOne(id);
  }

  async update(id: number, updateTrackInput: UpdateTrackInput) {
    return this.trackRepository.update(id, updateTrackInput);
  }

  async remove(id: number) {
    return this.trackRepository.delete(id);
  }
}
