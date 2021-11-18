import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { NamespacesService } from './namespaces.service';
import { Namespace } from './entities/namespace.entity';
import { CreateNamespaceInput } from './dto/create-namespace.input';

@Resolver(() => Namespace)
export class NamespacesResolver {
  constructor(private readonly namespacesService: NamespacesService) {}

  @Mutation(() => Namespace)
  createNamespace(
    @Args('createNamespaceInput') createNamespaceInput: CreateNamespaceInput,
  ) {
    return this.namespacesService.create(createNamespaceInput);
  }

  @Query(() => [Namespace], { name: 'namespaces' })
  findAll() {
    return this.namespacesService.findAll();
  }

  @Query(() => Namespace, { name: 'namespace' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.namespacesService.findOne(id);
  }

  @Mutation(() => Namespace)
  removeNamespace(@Args('id', { type: () => Int }) id: number) {
    return this.namespacesService.remove(id);
  }
}
