import { CreateWaveformInput } from './create-waveform.input';
import { InputType, Field, PartialType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateWaveformInput extends PartialType(CreateWaveformInput) {
  @Field(() => Int)
  id: number;

  @Field()
  full: string;

  @Field()
  small: string;
}
