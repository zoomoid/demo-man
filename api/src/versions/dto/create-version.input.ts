import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateVersionInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
