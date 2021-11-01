import { Injectable } from '@nestjs/common';
import { CreateCoverInput } from './dto/create-cover.input';
import { UpdateCoverInput } from './dto/update-cover.input';

@Injectable()
export class CoversService {
  create(createCoverInput: CreateCoverInput) {
    return 'This action adds a new cover';
  }

  findAll() {
    return `This action returns all covers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cover`;
  }

  update(id: number, updateCoverInput: UpdateCoverInput) {
    return `This action updates a #${id} cover`;
  }

  remove(id: number) {
    return `This action removes a #${id} cover`;
  }
}
