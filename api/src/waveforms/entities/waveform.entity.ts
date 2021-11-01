import { ObjectType, Field } from '@nestjs/graphql';
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
  @Field({ description: 'Waveform ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
