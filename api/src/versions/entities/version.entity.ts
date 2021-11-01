import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Track } from '../../tracks/entities/track.entity';
import { Waveform } from '../../waveforms/entities/waveform.entity';

@ObjectType()
@Entity()
export class Version {
  @Field({ description: 'Track version ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Int)
  @Column()
  revision: number;

  @Field(() => Waveform)
  @OneToOne(() => Waveform, (waveform) => waveform.version)
  waveform: Waveform;

  @Field(() => Track)
  @ManyToOne(() => Track, (track) => track.versions)
  track: Track;

  @Field()
  @Column()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @Column()
  @UpdateDateColumn()
  updated_at: Date;
}
