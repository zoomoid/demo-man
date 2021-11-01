import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { Album } from '../../albums/entities/album.entity';
import { Version } from '../../versions/entities/version.entity';

@ObjectType()
@Entity()
export class Track {
  @Field(() => ID, { description: 'Entity ID' })
  @PrimaryGeneratedColumn()
  id: string;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  artist: string;

  @Field()
  @Column()
  albumartist: string;

  @Field(() => Album)
  @OneToMany(() => Album, (album) => album.tracks)
  album: Album;

  @Field(() => Int)
  @VersionColumn()
  revision: number;

  @Field(() => [Version])
  @OneToMany(() => Version, (version) => version.track)
  versions: Version[];

  @Field()
  @Column()
  genre: string;

  @Field(() => Int)
  @Column()
  no: number;

  @Field()
  @Column()
  composer: string;

  @Field()
  @Column()
  url: string;

  @Field()
  @Column()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @Column()
  @UpdateDateColumn()
  updated_at: Date;
}
