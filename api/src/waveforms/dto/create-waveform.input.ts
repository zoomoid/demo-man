import { InputType } from '@nestjs/graphql';
import { Waveform } from '../entities/waveform.model';

@InputType()
export class CreateWaveformInput extends Waveform {}
