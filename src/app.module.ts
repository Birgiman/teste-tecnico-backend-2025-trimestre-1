import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { createKeyv } from '@keyv/redis';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => ({
        store: createKeyv(process.env.REDIS_URL || 'redis://localhost:6379'),
        ttl: 60_600,
      }),
    }),
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
