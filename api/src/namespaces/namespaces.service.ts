import { Injectable } from '@nestjs/common';
import { CreateNamespaceInput } from './dto/create-namespace.input';
import { UpdateNamespaceInput } from './dto/update-namespace.input';

@Injectable()
export class NamespacesService {
  create(createNamespaceInput: CreateNamespaceInput) {
    return 'This action adds a new namespace';
  }

  findAll() {
    return `This action returns all namespaces`;
  }

  findOne(id: number) {
    return `This action returns a #${id} namespace`;
  }

  update(id: number, updateNamespaceInput: UpdateNamespaceInput) {
    return `This action updates a #${id} namespace`;
  }

  remove(id: number) {
    return `This action removes a #${id} namespace`;
  }
}
