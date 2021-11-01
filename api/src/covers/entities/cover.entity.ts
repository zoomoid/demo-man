import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Album } from '../../albums/entities/album.entity';

@ObjectType()
@Entity()
export class Cover {
  @Field(() => ID, { description: 'Entity ID' })
  @PrimaryGeneratedColumn()
  id: string;

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

  @Field()
  @Column()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @Column()
  @UpdateDateColumn()
  updated_at: Date;
}
