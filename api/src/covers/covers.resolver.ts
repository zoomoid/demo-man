import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CoversService } from './covers.service';
import { Cover } from './entities/cover.entity';
import { CreateCoverInput } from './dto/create-cover.input';
import { UpdateCoverInput } from './dto/update-cover.input';

@Resolver(() => Cover)
export class CoversResolver {
  constructor(private readonly coversService: CoversService) {}

  @Mutation(() => Cover)
  createCover(@Args('createCoverInput') createCoverInput: CreateCoverInput) {
    return this.coversService.create(createCoverInput);
  }

  @Query(() => [Cover], { name: 'covers' })
  findAll() {
    return this.coversService.findAll();
  }

  @Query(() => Cover, { name: 'cover' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.coversService.findOne(id);
  }

  @Mutation(() => Cover)
  updateCover(@Args('updateCoverInput') updateCoverInput: UpdateCoverInput) {
    return this.coversService.update(updateCoverInput.id, updateCoverInput);
  }

  @Mutation(() => Cover)
  removeCover(@Args('id', { type: () => Int }) id: number) {
    return this.coversService.remove(id);
  }
}
