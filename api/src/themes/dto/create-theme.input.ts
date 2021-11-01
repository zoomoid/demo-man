import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateThemeInput {
  @Field({ description: '' })
  customColor: string;

  @Field({ description: '' })
  customTextColor: string;

  @Field({ description: '' })
  customAccent: string;

  @Field({ description: '' })
  computedColor: string;

  @Field({ description: '' })
  computedTextColor: string;

  @Field({ description: '' })
  computedAccent: string;

  @Field()
  albumId: string;
}
