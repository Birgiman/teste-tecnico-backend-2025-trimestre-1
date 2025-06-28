import { Module } from '@nestjs/common';
import { StreamResponseService } from 'src/services/stream-response.service';
import { VideoStorageService } from 'src/services/video-storage.service';
import { StaticController } from './static.controller';
import { StaticService } from './static.service';

@Module({
  controllers: [StaticController],
  providers: [StaticService, VideoStorageService, StreamResponseService],
})
export class StaticModule {}
