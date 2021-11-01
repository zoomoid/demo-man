import { CreateCoverInput } from './create-cover.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCoverInput extends PartialType(CreateCoverInput) {
  @Field(() => Int)
  id: number;
}
