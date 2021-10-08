import { ObjectType, Field } from '@nestjs/graphql';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { GlobalObjectMetadata } from '../../objects';

export class NamespaceMetadata extends GlobalObjectMetadata {}

export class NamespaceSpec {
  [x: string]: unknown;
}

export const NamespaceSchema = new mongoose.Schema({
  metadata: NamespaceMetadata,
  spec: NamespaceSpec,
});

@ObjectType()
export class Namespace extends Document {
  @Field(() => NamespaceMetadata, { description: 'Namespace object metadata' })
  metadata: NamespaceMetadata;

  @Field(() => NamespaceSpec, { description: 'Namespace object spec' })
  spec: NamespaceSpec;
}
