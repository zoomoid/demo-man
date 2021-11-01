import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateCoverInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
