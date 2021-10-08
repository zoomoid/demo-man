import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ThemesService } from './themes.service';
import { Theme } from './entities/theme.model';
import { CreateThemeInput } from './dto/create-theme.input';
import { UpdateThemeInput } from './dto/update-theme.input';

@Resolver(() => Theme)
export class ThemesResolver {
  constructor(private readonly themesService: ThemesService) {}

  @Mutation(() => Theme)
  createTheme(@Args('createThemeInput') createThemeInput: CreateThemeInput) {
    return this.themesService.create(createThemeInput);
  }

  @Query(() => [Theme], { name: 'themes' })
  findAll() {
    return this.themesService.findAll();
  }

  @Query(() => Theme, { name: 'theme' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.themesService.findOne(id);
  }

  @Mutation(() => Theme)
  updateTheme(@Args('updateThemeInput') updateThemeInput: UpdateThemeInput) {
    return this.themesService.update(updateThemeInput.id, updateThemeInput);
  }

  @Mutation(() => Theme)
  removeTheme(@Args('id', { type: () => Int }) id: number) {
    return this.themesService.remove(id);
  }
}
