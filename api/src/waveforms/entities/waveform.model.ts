import { Column, Entity } from 'typeorm';
import { NamespacedResourceMetadata, Resource } from '../../objects';

export class WaveformMetadata extends NamespacedResourceMetadata {}

export class WaveformSpec {
  @Column()
  full: string;

  @Column()
  small: string;
}

@Entity()
export class Waveform extends Resource {
  @Column({
    type: String,
    default: 'Track',
  })
  kind: string;

  @Column(() => WaveformMetadata)
  metadata: WaveformMetadata;

  @Column(() => WaveformSpec)
  spec: WaveformSpec;
}
