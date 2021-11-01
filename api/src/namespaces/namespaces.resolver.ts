import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { NamespacesService } from './namespaces.service';
import { Namespace } from './entities/namespace.entity';
import { CreateNamespaceInput } from './dto/create-namespace.input';
import { UpdateNamespaceInput } from './dto/update-namespace.input';
import { ObjectID } from 'typeorm';

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
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.namespacesService.findOne({ id: new ObjectID(id) });
  }

  @Mutation(() => Namespace)
  updateNamespace(
    @Args('updateNamespaceInput') updateNamespaceInput: UpdateNamespaceInput,
  ) {
    return this.namespacesService.update(
      updateNamespaceInput.id,
      updateNamespaceInput,
    );
  }

  @Mutation(() => Namespace)
  removeNamespace(@Args('name', { type: () => String }) name: string) {
    return this.namespacesService.remove({ name });
  }
}
