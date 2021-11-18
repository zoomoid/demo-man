import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Album } from '../../albums/entities/album.entity';
import { DateScalar } from '../../common/scalars/date.scalar';

@ObjectType()
@Entity()
export class Namespace {
  @Field(() => ID, { description: 'Entity ID' })
  @PrimaryGeneratedColumn()
  id: string;

  @Field({ nullable: false })
  @Column()
  name: string;

  @Field({ defaultValue: false })
  @Column({ default: false })
  public: boolean;

  @Field(() => [Album], { nullable: true })
  @OneToMany(() => Album, (album) => album.namespace)
  albums: Album[];

  @Field({ defaultValue: '/' })
  @Column({ default: '/' })
  pathPrefix: string;

  @Field(() => DateScalar)
  @Column()
  @CreateDateColumn()
  created_at: Date;

  @Field(() => DateScalar)
  @Column()
  @UpdateDateColumn()
  updated_at: Date;
}
