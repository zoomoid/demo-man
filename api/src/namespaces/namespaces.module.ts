import { Module } from '@nestjs/common';
import { NamespacesService } from './namespaces.service';
import { NamespacesResolver } from './namespaces.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Namespace } from './entities/namespace.entity';

@Module({
  providers: [NamespacesResolver, NamespacesService],
  imports: [TypeOrmModule.forFeature([Namespace])],
})
export class NamespacesModule {}
