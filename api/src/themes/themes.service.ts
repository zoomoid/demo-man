import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateThemeInput } from './dto/create-theme.input';
import { UpdateThemeInput } from './dto/update-theme.input';
import { Theme } from './entities/theme.entity';

@Injectable()
export class ThemesService {
  constructor(
    @InjectRepository(Theme) private themeRepository: Repository<Theme>,
  ) {}

  async create(createThemeInput: CreateThemeInput) {
    return this.themeRepository.create(createThemeInput);
  }

  async findAll() {
    return this.themeRepository.find();
  }

  async findOne(id: number) {
    return this.themeRepository.findOne(id);
  }

  async update(id: number, updateThemeInput: UpdateThemeInput) {
    return this.themeRepository.update(id, updateThemeInput);
  }

  async remove(id: number) {
    return this.themeRepository.delete(id);
  }
}
