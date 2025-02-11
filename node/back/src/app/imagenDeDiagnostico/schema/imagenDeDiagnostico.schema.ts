import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ImagenDeDiagnostico extends Document {
  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  fecha_creacion: Date;

  @Prop({ required: true })
  descripcion: string;

  @Prop({ required: true, enum: ['normal', 'problema'] })
  tipo: 'normal' | 'problema';
}

export const ImagenDeDiagnosticoSchema =
  SchemaFactory.createForClass(ImagenDeDiagnostico);
