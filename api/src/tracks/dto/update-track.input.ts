import { CreateTrackInput } from './create-track.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateTrackInput extends PartialType(CreateTrackInput) {}
