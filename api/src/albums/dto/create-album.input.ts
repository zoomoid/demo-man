import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateAlbumInput {
  @Field({ description: 'Example field (placeholder)' })
  name: string;

  @Field()
  namespaceId: string;

  @Field()
  public: boolean;
}
