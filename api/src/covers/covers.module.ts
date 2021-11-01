import { Module } from '@nestjs/common';
import { CoversService } from './covers.service';
import { CoversResolver } from './covers.resolver';

@Module({
  providers: [CoversResolver, CoversService]
})
export class CoversModule {}
