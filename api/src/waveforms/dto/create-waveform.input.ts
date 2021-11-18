import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateWaveformInput {
  @Field(() => Int, { description: '' })
  versionId: number;

  @Field()
  full: string;

  @Field()
  small: string;
}
