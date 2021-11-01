import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
/**
 * TODO: theme columns can be normalized into own schemas
 */
export class Theme {
  @Field(() => ID, { description: 'Entity ID' })
  @PrimaryGeneratedColumn()
  id: string;

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

  @Field()
  @Column()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @Column()
  @UpdateDateColumn()
  updated_at: Date;
}
