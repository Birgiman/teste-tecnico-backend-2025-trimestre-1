import { Module } from '@nestjs/common';
import { UploadService } from './service/upload.service';
import { VideoStorageService } from './service/video-storage.service';
import { UploadController } from './upload.controller';

@Module({
  controllers: [UploadController],
  providers: [UploadService, VideoStorageService],
})
export class UploadModule {}
