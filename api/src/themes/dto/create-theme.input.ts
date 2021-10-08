import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateThemeInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
