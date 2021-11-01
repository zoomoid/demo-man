import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateTrackInput {
  @Field({ description: '' })
  title: string;

  @Field()
  artist: string;

  @Field()
  albumartist: string;

  @Field()
  albumId: string;

  @Field()
  genre: string;

  @Field()
  composer: string;
}
