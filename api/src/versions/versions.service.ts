import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVersionInput } from './dto/create-version.input';
import { UpdateVersionInput } from './dto/update-version.input';
import { Version } from './entities/version.entity';

@Injectable()
export class VersionsService {
  constructor(
    @InjectRepository(Version) private versionRepository: Repository<Version>,
  ) {}

  async create(createVersionInput: CreateVersionInput) {
    return this.versionRepository.create(createVersionInput);
  }

  async findAll() {
    return this.versionRepository.find();
  }

  async findOne(id: number) {
    return this.versionRepository.findOne(id);
  }

  async update(id: number, updateVersionInput: UpdateVersionInput) {
    return this.versionRepository.update(id, updateVersionInput);
  }

  async remove(id: number) {
    return this.versionRepository.delete(id);
  }
}
