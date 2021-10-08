import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { NamespacedObjectMetadata } from './Metadata';

export class WaveformMetadata extends NamespacedObjectMetadata {}

export class WaveformSpec {
  full: string;
  small: string;
}

@Entity()
export class Waveform {
  @ObjectIdColumn()
  id: ObjectID;

  @Column(() => WaveformMetadata)
  metadata: WaveformMetadata;

  @Column(() => WaveformSpec)
  spec: WaveformSpec;
}
