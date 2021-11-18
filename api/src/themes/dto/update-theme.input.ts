import { CreateThemeInput } from './create-theme.input';
import { InputType, Field, PartialType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateThemeInput extends PartialType(CreateThemeInput) {
  @Field(() => Int)
  id: number;
}
