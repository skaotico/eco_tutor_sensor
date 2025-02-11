// src/cloudinary/cloudinary.service.ts
import { Injectable } from '@nestjs/common';
import { CloudinaryConfigService } from './cloudinary.config';
import { v2 as cloudinary } from 'cloudinary'; // Asegúrate de importar v2
import * as fs from 'fs';
@Injectable()
export class CloudinaryService {
  constructor(private cloudinaryConfigService: CloudinaryConfigService) {
    CloudinaryConfigService.configureCloudinary();
  }

  async uploadImage(path: string) {
    try {
      console.log('Iniciando la carga de la imagen desde:', path);

      return new Promise((resolve, reject) => {
        const fileStream = fs.createReadStream(path);

        const uploadResponse = cloudinary.uploader.upload_stream(
          { resource_type: 'auto' },
          (error, result) => {
            if (error) {
              console.error(
                'Error al subir la imagen a Cloudinary:',
                error.message,
              );
              reject(
                new Error(
                  'Error al subir la imagen a Cloudinary: ' + error.message,
                ),
              );
            } else {
              console.log('Imagen subida con éxito:', result);
              resolve(result);
            }
          },
        );

        fileStream.pipe(uploadResponse);
      });
    } catch (error) {
      console.error('Error en el proceso de carga:', error);
      throw new Error('Error en el proceso de carga: ' + error.message);
    }
  }

  getImageUrl(publicId: string) {
    return cloudinary.url(publicId, { secure: true });
  }
}
