import { InputType } from '@nestjs/graphql';
import { Track } from '../entities/track.model';

@InputType()
export class CreateTrackInput extends Track {}
