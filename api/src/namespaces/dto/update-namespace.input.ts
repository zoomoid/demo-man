import { CreateNamespaceInput } from './create-namespace.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateNamespaceInput extends PartialType(CreateNamespaceInput) {
  @Field(() => Int)
  id: number;
}
