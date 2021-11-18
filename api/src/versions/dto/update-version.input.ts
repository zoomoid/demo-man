import { CreateVersionInput } from './create-version.input';
import { InputType, Field, PartialType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateVersionInput extends PartialType(CreateVersionInput) {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  waveformId: number;
}
