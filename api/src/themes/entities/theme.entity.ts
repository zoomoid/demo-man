import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DateScalar } from '../../common/scalars/date.scalar';

@ObjectType()
@Entity()
export class Theme {
  @Field(() => Int, { description: 'Entity ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  computedColor: string;

  @Field()
  @Column()
  computedTextColor: string;

  @Field()
  @Column()
  computedAccent: string;

  @Field()
  @Column()
  customColor: string;

  @Field()
  @Column()
  customTextColor: string;

  @Field()
  @Column()
  customAccent: string;

  @Field(() => DateScalar)
  @Column()
  @CreateDateColumn()
  created_at: Date;

  @Field(() => DateScalar)
  @Column()
  @UpdateDateColumn()
  updated_at: Date;
}
