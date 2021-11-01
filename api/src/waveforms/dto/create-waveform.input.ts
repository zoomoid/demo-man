import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateWaveformInput {
  @Field({ description: '' })
  versionId: string;

  @Field()
  full: string;

  @Field()
  small: string;
}
