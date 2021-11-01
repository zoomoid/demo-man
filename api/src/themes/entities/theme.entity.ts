import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
/** TODO: theme columns can be normalized into own schemas */
export class Theme {
  @Field({ description: 'Theme ID' })
  @PrimaryGeneratedColumn('uuid')
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
}
