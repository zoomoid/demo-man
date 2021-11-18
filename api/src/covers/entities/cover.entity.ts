import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Album } from '../../albums/entities/album.entity';
import { DateScalar } from '../../common/scalars/date.scalar';

@ObjectType()
@Entity()
export class Cover {
  @Field(() => Int, { description: 'Entity ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @Field({
    nullable: false,
    description: 'Fully-qualified URL to an album cover',
  })
  @Column()
  url: string;

  @Field(() => Int, { defaultValue: 0, description: 'Cover revision' })
  @Column()
  revision: number;

  @Field(() => Album)
  @ManyToOne(() => Album, (album) => album.covers)
  album: Album;

  @Field()
  @Column()
  mimeType: string;

  @Field(() => DateScalar)
  @Column()
  @CreateDateColumn()
  created_at: Date;

  @Field(() => DateScalar)
  @Column()
  @UpdateDateColumn()
  updated_at: Date;
}
