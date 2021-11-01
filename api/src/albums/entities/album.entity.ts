import { ObjectType, Field } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cover } from '../../covers/entities/cover.entity';
import { Namespace } from '../../namespaces/entities/namespace.entity';
import { Track } from '../../tracks/entities/track.entity';

@ObjectType()
@Entity()
export class Album {
  @Field({ description: 'Album ID' })
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Field({ nullable: false })
  name: string;

  @Field({ defaultValue: false })
  public: boolean;

  @Field(() => [Cover])
  @OneToMany(() => Cover, (cover) => cover.album)
  covers: Cover[];

  @Field(() => [Track])
  @OneToMany(() => Track, (track) => track.album)
  tracks: Track[];

  @Field(() => Namespace)
  @ManyToOne(() => Namespace, (namespace) => namespace.albums)
  namespace: Namespace;

  @Field()
  @Column()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @Column()
  @UpdateDateColumn()
  updated_at: Date;
}
