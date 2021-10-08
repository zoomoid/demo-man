import { InputType } from '@nestjs/graphql';
import { Theme } from '../entities/theme.model';

@InputType()
export class CreateThemeInput extends Theme {}
