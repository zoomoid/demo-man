import { Module } from '@nestjs/common';
import { ThemesService } from './themes.service';
import { ThemesResolver } from './themes.resolver';

@Module({
  providers: [ThemesResolver, ThemesService]
})
export class ThemesModule {}
