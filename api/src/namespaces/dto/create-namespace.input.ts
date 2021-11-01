import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateNamespaceInput {
  @Field()
  name: string;

  @Field()
  pathPrefix: string;
}
