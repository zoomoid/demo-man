import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DateScalar } from '../../common/scalars/date.scalar';
import { Cover } from '../../covers/entities/cover.entity';
import { Namespace } from '../../namespaces/entities/namespace.entity';
import { Track } from '../../tracks/entities/track.entity';

@ObjectType()
@Entity()
export class Album {
  @Field(() => Int, { description: 'Entity ID' })
  @PrimaryGeneratedColumn()
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

  @Field(() => DateScalar)
  @Column()
  @CreateDateColumn()
  created_at: Date;

  @Field(() => DateScalar)
  @Column()
  @UpdateDateColumn()
  updated_at: Date;
}
