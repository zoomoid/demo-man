import { CreateThemeInput } from './create-theme.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateThemeInput extends PartialType(CreateThemeInput) {
  @Field(() => ID)
  id: string;
}
