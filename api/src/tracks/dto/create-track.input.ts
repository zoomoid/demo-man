import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateTrackInput {
  @Field({ description: '' })
  title: string;

  @Field()
  artist: string;

  @Field()
  albumartist: string;

  @Field(() => Int)
  albumId: number;

  @Field()
  genre: string;

  @Field()
  composer: string;
}
