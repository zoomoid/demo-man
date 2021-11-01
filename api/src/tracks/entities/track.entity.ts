import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
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
  @Field({ description: 'Track ID' })
  @PrimaryGeneratedColumn('uuid')
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
  bpm: string;

  @Field()
  @Column()
  genre: string;

  @Field(() => Int)
  @Column()
  no: number;

  @Field()
  @Column('text')
  comment: string;

  @Field()
  @Column()
  composer: string;

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
