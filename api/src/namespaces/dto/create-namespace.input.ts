import { InputType } from '@nestjs/graphql';
import { Namespace } from '../entities/namespace.entity';

@InputType()
export class CreateNamespaceInput extends Namespace {}
