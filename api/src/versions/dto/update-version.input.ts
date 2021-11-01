import { CreateVersionInput } from './create-version.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateVersionInput extends PartialType(CreateVersionInput) {
  @Field()
  id: string;

  @Field()
  waveformId: string;
}
