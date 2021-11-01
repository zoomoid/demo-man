import { Injectable } from '@nestjs/common';
import { CreateVersionInput } from './dto/create-version.input';
import { UpdateVersionInput } from './dto/update-version.input';

@Injectable()
export class VersionsService {
  create(createVersionInput: CreateVersionInput) {
    return 'This action adds a new version';
  }

  findAll() {
    return `This action returns all versions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} version`;
  }

  update(id: number, updateVersionInput: UpdateVersionInput) {
    return `This action updates a #${id} version`;
  }

  remove(id: number) {
    return `This action removes a #${id} version`;
  }
}
