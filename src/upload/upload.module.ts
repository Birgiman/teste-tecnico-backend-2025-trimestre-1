import { Module } from '@nestjs/common';
import { VideoStorageService } from '../services/video-storage.service';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  controllers: [UploadController],
  providers: [UploadService, VideoStorageService],
})
export class UploadModule {}
