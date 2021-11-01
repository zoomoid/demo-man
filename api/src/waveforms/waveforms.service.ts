import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Version } from '../versions/entities/version.entity';
import { CreateWaveformInput } from './dto/create-waveform.input';
import { UpdateWaveformInput } from './dto/update-waveform.input';
import { Waveform } from './entities/waveform.entity';

@Injectable()
export class WaveformsService {
  constructor(
    @InjectRepository(Waveform)
    private waveformRepository: Repository<Waveform>,

    @InjectRepository(Version)
    private versionRepository: Repository<Version>,
  ) {}

  async create(createWaveformInput: CreateWaveformInput) {
    const waveform = new Waveform();
    waveform.full = createWaveformInput.full;
    waveform.small = createWaveformInput.small;

    const version = await this.versionRepository.findOne(
      createWaveformInput.versionId,
    );

    waveform.version = version;

    this.waveformRepository.save(waveform);

    version.waveform = waveform;
    this.versionRepository.save(version);
  }

  async findAll() {
    return await this.waveformRepository.find();
  }

  async findOne(id: string) {
    return await this.waveformRepository.findOne(id);
  }

  async update(id: number, updateWaveformInput: UpdateWaveformInput) {
    const waveform = await this.waveformRepository.findOne(id);
    waveform.full = updateWaveformInput.full;
    waveform.small = updateWaveformInput.small;
    return await this.waveformRepository.update(id, waveform);
  }

  remove(id: number) {
    return `This action removes a #${id} waveform`;
  }
}
