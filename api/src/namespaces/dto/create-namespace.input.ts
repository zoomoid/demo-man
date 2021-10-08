import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateNamespaceInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
