// src/cloudinary/cloudinary.module.ts
import { Module } from '@nestjs/common';
import { CloudinaryConfigService } from './cloudinary.config';
import { CloudinaryService } from './cloudinary.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [CloudinaryConfigService, CloudinaryService],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
