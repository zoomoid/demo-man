import { CreateWaveformInput } from './create-waveform.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateWaveformInput extends PartialType(CreateWaveformInput) {
  @Field(() => Int)
  id: number;
}
