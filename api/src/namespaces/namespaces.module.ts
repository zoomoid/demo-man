import { Module } from '@nestjs/common';
import { NamespacesService } from './namespaces.service';
import { NamespacesResolver } from './namespaces.resolver';

@Module({
  providers: [NamespacesResolver, NamespacesService],
})
export class NamespacesModule {}
