import { Inject, Injectable } from '@nestjs/common';
import { Model, FilterQuery, UpdateQuery } from 'mongoose';
import { CreateWaveformInput } from './dto/create-waveform.input';
import { Waveform } from './entities/waveform.model';

@Injectable()
export class WaveformsService {
  constructor(@Inject(Waveform.name) private themeModel: Model<Waveform>) {}

  async create(input: CreateWaveformInput): Promise<Waveform> {
    return this.themeModel.create(input);
  }

  async findAll(): Promise<Waveform[]> {
    return this.themeModel.find().lean();
  }

  async findOne(query: FilterQuery<Waveform>): Promise<Waveform> {
    return this.themeModel.findOne(query).lean();
  }

  async update(
    query: FilterQuery<Waveform>,
    updateWaveformInput: UpdateQuery<Waveform>,
  ): Promise<Waveform> {
    return this.themeModel.updateOne(query, updateWaveformInput).lean();
  }

  async remove(query: FilterQuery<Waveform>) {
    return this.themeModel.deleteOne(query);
  }
}
