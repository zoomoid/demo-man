import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNamespaceInput } from './dto/create-namespace.input';
import { Namespace } from './entities/namespace.entity';

/**
 * Namespaces are immutable after creation, hence it lacks an update function,
 * only having create and remove as operations
 */
@Injectable()
export class NamespacesService {
  constructor(
    @InjectRepository(Namespace)
    private namespaceRepository: Repository<Namespace>,
  ) {}

  async create(input: CreateNamespaceInput): Promise<Namespace> {
    return this.namespaceRepository.create(input);
  }

  async findAll(): Promise<Namespace[]> {
    return this.namespaceRepository.find();
  }

  async findOne(id: number): Promise<Namespace> {
    return this.namespaceRepository.findOne(id);
  }

  async remove(id: number) {
    return this.namespaceRepository.delete(id);
  }
}
