import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { NamespacesResolver } from './namespaces/namespaces.resolver';
import { NamespacesModule } from './namespaces/namespaces.module';
import { WaveformsModule } from './waveforms/waveforms.module';
import { ThemesModule } from './themes/themes.module';

interface EnvironmentVariables {
  TOKEN: string;
  MONGODB_URL: string;
  WAVEMAN: string;
  PICASSO: string;
}

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<EnvironmentVariables>) => ({
        uri: configService.get('MONGODB_URL'),
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot(),
    NamespacesModule,
    WaveformsModule,
    ThemesModule,
  ],
  controllers: [AppController],
  providers: [AppService, NamespacesResolver],
})
export class AppModule {}
