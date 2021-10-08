import { Column, Entity } from 'typeorm';
import {
  NamespacedResourceMetadata,
  Resource,
  ResourceSpec,
} from '../../objects';

interface BaseTheme {
  color: number[];
  textColor: number[];
  accent: number[];
}

interface ComputedTheme extends BaseTheme {
  palette: number[][];
}

type CustomTheme = BaseTheme;

export class ThemeMetadata extends NamespacedResourceMetadata {}

export class ComputedThemeSpec implements ComputedTheme {
  @Column()
  color: number[];

  @Column()
  textColor: number[];

  @Column()
  accent: number[];

  @Column()
  palette: number[][];
}

export class CustomThemeSpec implements CustomTheme {
  @Column()
  color: number[];

  @Column()
  textColor: number[];

  @Column()
  accent: number[];
}

export class ThemeSpec extends ResourceSpec {
  @Column(() => ComputedThemeSpec)
  computed: ComputedTheme;

  @Column(() => CustomThemeSpec)
  custom: CustomTheme;
}

@Entity()
export class Theme extends Resource {
  @Column({
    type: String,
    default: 'Theme',
  })
  kind: string;

  @Column(() => ThemeMetadata)
  metadata: ThemeMetadata;

  @Column(() => ThemeSpec)
  spec: ThemeSpec;
}
