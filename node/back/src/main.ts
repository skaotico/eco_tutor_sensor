import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CloudinaryConfigService } from './app/cloudinary/cloudinary.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Eco Tutor Sensor API')
    .setDescription(
      'La API para gestionar sensores y datos relacionados con el eco-tutor.',
    )
    .setVersion('1.0')
    .addTag('sensor')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  CloudinaryConfigService.configureCloudinary();
  await app.listen(3001);
}
bootstrap();
