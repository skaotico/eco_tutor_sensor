import { Controller, Param, Post, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiParam, ApiTags } from '@nestjs/swagger';

@Controller('cloudinary')
@ApiTags('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload/:path')
  @ApiParam({
    name: 'path',
    description: 'Ruta de la imagen a subir',
    type: String,
    required: true,
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10485760 },
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(
            null,
            file.fieldname + '-' + uniqueSuffix + extname(file.originalname),
          );
        },
      }),
    }),
  )
  async uploadImage(@Param('path') path: string) {
    const result = await this.cloudinaryService.uploadImage(path);
    return { message: 'Imagen subida con éxito', result };
  }

  @Post('get-image/:publicId')
  @ApiParam({
    name: 'publicId',
    description: 'ID público de la imagen en Cloudinary',
    type: String,
    required: true,
  })
  async getImageUrl(@Param('publicId') publicId: string) {
    const imageUrl = await this.cloudinaryService.getImageUrl(publicId);
    return { imageUrl };
  }
}
