import { v2 as cloudinary } from 'cloudinary';

export class CloudinaryConfigService {
  static configureCloudinary() {
    const cloudinaryUrl = process.env.CLOUDINARY_URL;

    if (!cloudinaryUrl) {
      throw new Error(
        'La variable de entorno CLOUDINARY_URL no está configurada.',
      );
    }

    cloudinary.config({
      cloud_name: 'dhdmhu3du',
      api_key: '459926816875936',
      api_secret: 'YMzLYkSqm3N4DlTnJJfhqKr6fRQ',
    });
  }
}
