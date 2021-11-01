import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { NamespacesResolver } from './namespaces/namespaces.resolver';
import { NamespacesModule } from './namespaces/namespaces.module';
import { ThemesModule } from './themes/themes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumsModule } from './albums/albums.module';
import { CoversModule } from './covers/covers.module';
import { TracksModule } from './tracks/tracks.module';
import { VersionsModule } from './versions/versions.module';
import { WaveformsModule } from './waveforms/waveforms.module';

interface EnvironmentVariables {
  TOKEN: string;
  MONGODB_URL: string;
  WAVEMAN: string;
  PICASSO: string;
}

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<EnvironmentVariables>) => ({
        type: 'mongodb',
        url: configService.get('MONGODB_URL'),
        // entities: ['**/entities/*.model.ts'],
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot({}),
    NamespacesModule,
    WaveformsModule,
    ThemesModule,
    AlbumsModule,
    CoversModule,
    TracksModule,
    VersionsModule,
  ],
  controllers: [AppController],
  providers: [AppService, NamespacesResolver],
})
export class AppModule {}
