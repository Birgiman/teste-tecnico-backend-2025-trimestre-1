import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { createKeyv } from '@keyv/redis';
import { StaticModule } from './static/static.module';
import { UploadModule } from './upload/upload.module';

const host = process.env.REDIS_HOST ?? 'localhost';
const port = process.env.REDIS_PORT ?? '6379';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => ({
        store: createKeyv(`redis://${host}:${port}`),
        ttl: 60_600,
      }),
    }),
    UploadModule,
    StaticModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
