import { InputType } from '@nestjs/graphql';
import { Namespace } from '../entities/namespace.model';

@InputType()
export class CreateNamespaceInput extends Namespace {}
