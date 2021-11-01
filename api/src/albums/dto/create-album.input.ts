import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateAlbumInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
