import { CreateWaveformInput } from './create-waveform.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateWaveformInput extends PartialType(CreateWaveformInput) {
  @Field()
  id: string;

  @Field()
  full: string;

  @Field()
  small: string;
}
