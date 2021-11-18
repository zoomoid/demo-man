import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateCoverInput {
  @Field({ description: '' })
  url: string;

  @Field(() => Int)
  albumId: number;

  @Field(() => String)
  mimeType: string;
}
