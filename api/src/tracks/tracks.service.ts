import { Inject, Injectable } from '@nestjs/common';
import { Model, FilterQuery, UpdateQuery } from 'mongoose';
import { Track } from './entities/track.model';

@Injectable()
export class TracksService {
  constructor(@Inject(Track.name) private trackModel: Model<Track>) {}

  async create(input: Track): Promise<Track> {
    return this.trackModel.create(input);
  }

  async findAll(): Promise<Track[]> {
    return this.trackModel.find().lean();
  }

  async findOne(query: FilterQuery<Track>): Promise<Track> {
    return this.trackModel.findOne(query).lean();
  }

  async update(
    query: FilterQuery<Track>,
    updateTrackInput: UpdateQuery<Track>,
  ): Promise<Track> {
    return this.trackModel.updateOne(query, updateTrackInput).lean();
  }

  async remove(query: FilterQuery<Track>) {
    return this.trackModel.deleteOne(query);
  }
}
