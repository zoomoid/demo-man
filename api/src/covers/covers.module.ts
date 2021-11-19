import { Module } from '@nestjs/common';
import { CoversService } from './covers.service';
import { CoversResolver } from './covers.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cover } from './entities/cover.entity';

@Module({
  providers: [CoversResolver, CoversService],
  imports: [TypeOrmModule.forFeature([Cover])],
})
export class CoversModule {}
