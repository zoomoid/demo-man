import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateCoverInput {
  @Field({ description: '' })
  url: string;

  @Field()
  albumId: string;

  @Field()
  mimeType: string;
}
