import { CreateVersionInput } from './create-version.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateVersionInput extends PartialType(CreateVersionInput) {
  @Field(() => Int)
  id: number;
}
