import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
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
  @Field(() => Int, { description: 'Track version ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column()
  revision: number;

  @Field()
  @Column()
  url: string;

  @Field(() => Waveform)
  @OneToOne(() => Waveform, (waveform) => waveform.version)
  waveform: Waveform;

  @Field(() => Track)
  @ManyToOne(() => Track, (track) => track.versions)
  track: Track;

  @Field()
  @Column('text')
  comment: string;

  @Field()
  @Column()
  bpm: string;

  @Field(() => Float)
  @Column()
  duration: number;

  @Field(() => Float)
  @Column()
  sr: number;

  @Field(() => Float)
  @Column()
  bitrate: number;

  @Field()
  @Column()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @Column()
  @UpdateDateColumn()
  updated_at: Date;
}
