import { ObjectType, Field } from '@nestjs/graphql';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { NamespacedObjectMetadata } from '../../objects';

export class ThemeMetadata extends NamespacedObjectMetadata {}

type BaseTheme = {
  color: number[];
  textColor: number[];
  accent: number[];
};

type ComputedTheme = BaseTheme & {
  palette: number[][];
};

type CustomTheme = BaseTheme;

export class ThemeSpec {
  computed: ComputedTheme;
  custom: CustomTheme;
}

export const ThemeSchema = new mongoose.Schema({
  metadata: ThemeMetadata,
  spec: ThemeSpec,
});

@ObjectType()
export class Theme extends Document {
  @Field(() => ThemeMetadata, { description: 'Theme object metadata' })
  metadata: ThemeMetadata;

  @Field(() => ThemeSpec, { description: 'Theme object spec' })
  spec: ThemeSpec;
}
