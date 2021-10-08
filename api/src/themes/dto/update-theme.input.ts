import { CreateThemeInput } from './create-theme.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateThemeInput extends PartialType(CreateThemeInput) {}
