import { InputType, Field, Float, Int } from '@nestjs/graphql';

@InputType()
export class CreateVersionInput {
  @Field(() => Int, { description: '' })
  trackId: number;

  @Field()
  url: string;

  @Field()
  comment: string;

  @Field()
  bpm: string;

  @Field(() => Float)
  duration: number;

  @Field(() => Float)
  sr: number;

  @Field(() => Float)
  bitrate: number;
}
