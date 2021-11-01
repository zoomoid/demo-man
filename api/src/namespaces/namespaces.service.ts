import { Inject, Injectable } from '@nestjs/common';
import { Model, FilterQuery, UpdateQuery } from 'mongoose';
import { CreateNamespaceInput } from './dto/create-namespace.input';
import { Namespace } from './entities/namespace.entity';

@Injectable()
export class NamespacesService {
  constructor(@Inject(Namespace.name) private themeModel: Model<Namespace>) {}

  async create(input: CreateNamespaceInput): Promise<Namespace> {
    return this.themeModel.create(input);
  }

  async findAll(): Promise<Namespace[]> {
    return this.themeModel.find().lean();
  }

  async findOne(query: FilterQuery<Namespace>): Promise<Namespace> {
    return this.themeModel.findOne(query).lean();
  }

  async update(
    query: FilterQuery<Namespace>,
    updateNamespaceInput: UpdateQuery<Namespace>,
  ): Promise<Namespace> {
    return this.themeModel.updateOne(query, updateNamespaceInput).lean();
  }

  async remove(query: FilterQuery<Namespace>) {
    return this.themeModel.deleteOne(query);
  }
}
