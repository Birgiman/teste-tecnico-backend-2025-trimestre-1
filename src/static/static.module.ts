import { Module } from '@nestjs/common';
import { VideoStorageService } from 'src/services/video-storage.service';
import { StaticController } from './static.controller';
import { StaticService } from './static.service';

@Module({
  controllers: [StaticController],
  providers: [StaticService, VideoStorageService],
})
export class StaticModule {}
