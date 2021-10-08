import { Injectable } from '@nestjs/common';
import { CreateWaveformInput } from './dto/create-waveform.input';
import { UpdateWaveformInput } from './dto/update-waveform.input';

@Injectable()
export class WaveformsService {
  create(createWaveformInput: CreateWaveformInput) {
    return 'This action adds a new waveform';
  }

  findAll() {
    return `This action returns all waveforms`;
  }

  findOne(id: number) {
    return `This action returns a #${id} waveform`;
  }

  update(id: number, updateWaveformInput: UpdateWaveformInput) {
    return `This action updates a #${id} waveform`;
  }

  remove(id: number) {
    return `This action removes a #${id} waveform`;
  }
}
