import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class CreateVersionInput {
  @Field({ description: '' })
  trackId: string;

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
