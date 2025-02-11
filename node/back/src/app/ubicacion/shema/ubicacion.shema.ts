import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Ubicacion extends Document {
  @Prop({ required: true })
  latitud: number;

  @Prop({ required: true })
  longitud: number;

  @Prop({ required: true })
  fecha: Date;
}

export const UbicacionSchema = SchemaFactory.createForClass(Ubicacion);
