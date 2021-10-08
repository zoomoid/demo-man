import { CreateWaveformInput } from './create-waveform.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateWaveformInput extends PartialType(CreateWaveformInput) {}
