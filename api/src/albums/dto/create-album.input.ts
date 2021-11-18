import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateAlbumInput {
  @Field({ description: 'Example field (placeholder)' })
  name: string;

  @Field(() => Int)
  namespaceId: number;

  @Field(() => Boolean)
  public: boolean;
}
