import { CreateCoverInput } from './create-cover.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateCoverInput extends PartialType(CreateCoverInput) {
  @Field(() => ID)
  id: string;
}
