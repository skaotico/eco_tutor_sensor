import { Module } from '@nestjs/common';
import { ImagendediagnosticoService } from './imagendediagnostico.service';
import { ImagendediagnosticoController } from './imagendediagnostico.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ImagenDeDiagnostico,
  ImagenDeDiagnosticoSchema,
} from './schema/imagenDeDiagnostico.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ImagenDeDiagnostico.name, schema: ImagenDeDiagnosticoSchema },
    ]),
  ],
  controllers: [ImagendediagnosticoController],
  providers: [ImagendediagnosticoService],
  exports: [ImagendediagnosticoService],
})
export class ImagendediagnosticoModule {}
