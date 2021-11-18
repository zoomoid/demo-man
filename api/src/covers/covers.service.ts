import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCoverInput } from './dto/create-cover.input';
import { UpdateCoverInput } from './dto/update-cover.input';
import { Cover } from './entities/cover.entity';

@Injectable()
export class CoversService {
  constructor(
    @InjectRepository(Cover) private coverRepository: Repository<Cover>,
  ) {}

  async create(createCoverInput: CreateCoverInput) {
    return this.coverRepository.create(createCoverInput);
  }

  async findAll() {
    return this.coverRepository.find();
  }

  async findOne(id: number) {
    return this.coverRepository.findOne(id);
  }

  async update(id: number, updateCoverInput: UpdateCoverInput) {
    return this.coverRepository.update(id, updateCoverInput);
  }

  async remove(id: number) {
    return this.coverRepository.delete(id);
  }
}
