import { CreateNamespaceInput } from './create-namespace.input';
import { Field, ID, InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateNamespaceInput extends PartialType(CreateNamespaceInput) {
  @Field(() => ID)
  id: string;
}
