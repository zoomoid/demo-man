import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Version } from '../../versions/entities/version.entity';

@ObjectType()
@Entity()
export class Waveform {
  @Field(() => Int, { description: 'Waveform ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('xml')
  full: string;

  @Field()
  @Column('xml')
  small: string;

  @Field()
  @OneToOne(() => Version, (version) => version.waveform)
  version: Version;

  @Field()
  @Column()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @Column()
  @UpdateDateColumn()
  updated_at: Date;
}
