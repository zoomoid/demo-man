import { ObjectType, Field } from '@nestjs/graphql';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { NamespacedObjectMetadata } from '../../objects';

export class TrackMetadata extends NamespacedObjectMetadata {}

export class TrackSpec {
  general: {
    title: string;
    artist: string;
    albumartist: string;
    album: string;
    no: string | number;
    genre: string;
    composer: string;
    comment: string;
    bpm: string | number;
    duration: number;
  };
  file: {
    sr: number;
    bitrate: number;
    path: string;
    directory: string;
    name: string;
    mp3: string;
  };
  cover: {
    mimeType: string;
    publicUrl: string;
    localUrl: string;
    filename: string;
  };
}

export const TrackSchema = new mongoose.Schema({
  metadata: TrackMetadata,
  spec: TrackSpec,
});

@ObjectType()
export class Track extends Document {
  @Field(() => TrackMetadata, { description: 'Track object metadata' })
  metadata: TrackMetadata;

  @Field(() => TrackSpec, { description: 'track object spec' })
  spec: TrackSpec;
}
