import { ObjectType, Field, Int } from '@nestjs/graphql';
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
import { DateScalar } from '../../common/scalars/date.scalar';
import { Version } from '../../versions/entities/version.entity';

@ObjectType()
@Entity()
export class Track {
  @Field(() => Int, { description: 'Entity ID' })
  @PrimaryGeneratedColumn()
  id: number;

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

  @Field(() => DateScalar)
  @Column()
  @CreateDateColumn()
  created_at: Date;

  @Field(() => DateScalar)
  @Column()
  @UpdateDateColumn()
  updated_at: Date;
}
