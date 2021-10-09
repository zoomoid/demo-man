import { Inject, Injectable } from '@nestjs/common';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { CreateThemeInput } from './dto/create-theme.input';
import { Theme } from './entities/theme.model';

@Injectable()
export class ThemesService {
  constructor(@Inject(Theme.name) private themeModel: Model<Theme>) {}

  async create(input: CreateThemeInput): Promise<Theme> {
    return this.themeModel.create(input);
  }

  async findAll(): Promise<Theme[]> {
    return this.themeModel.find().lean();
  }

  async findOne(query: FilterQuery<Theme>): Promise<Theme> {
    return this.themeModel.findOne(query).lean();
  }

  async update(
    query: FilterQuery<Theme>,
    updateThemeInput: UpdateQuery<Theme>,
  ): Promise<Theme> {
    return this.themeModel.updateOne(query, updateThemeInput).lean();
  }

  async remove(query: FilterQuery<Theme>) {
    return this.themeModel.deleteOne(query);
  }
}
