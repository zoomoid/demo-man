import { ObjectType, Field } from '@nestjs/graphql';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { NamespacedObjectMetadata } from '../../objects';

export class WaveformMetadata extends NamespacedObjectMetadata {}

export class WaveformSpec {
  full: string;
  small: string;
}

export const WaveformSchema = new mongoose.Schema({
  metadata: WaveformMetadata,
  spec: WaveformSpec,
});

@ObjectType()
export class Waveform extends Document {
  @Field(() => WaveformMetadata, { description: 'Waveform object metadata' })
  metadata: WaveformMetadata;

  @Field(() => WaveformSpec, { description: 'Waveform object spec' })
  spec: WaveformSpec;
}
