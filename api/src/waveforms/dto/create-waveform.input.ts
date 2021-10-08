import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateWaveformInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
