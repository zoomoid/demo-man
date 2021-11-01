import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { VersionsService } from './versions.service';
import { Version } from './entities/version.entity';
import { CreateVersionInput } from './dto/create-version.input';
import { UpdateVersionInput } from './dto/update-version.input';

@Resolver(() => Version)
export class VersionsResolver {
  constructor(private readonly versionsService: VersionsService) {}

  @Mutation(() => Version)
  createVersion(@Args('createVersionInput') createVersionInput: CreateVersionInput) {
    return this.versionsService.create(createVersionInput);
  }

  @Query(() => [Version], { name: 'versions' })
  findAll() {
    return this.versionsService.findAll();
  }

  @Query(() => Version, { name: 'version' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.versionsService.findOne(id);
  }

  @Mutation(() => Version)
  updateVersion(@Args('updateVersionInput') updateVersionInput: UpdateVersionInput) {
    return this.versionsService.update(updateVersionInput.id, updateVersionInput);
  }

  @Mutation(() => Version)
  removeVersion(@Args('id', { type: () => Int }) id: number) {
    return this.versionsService.remove(id);
  }
}
