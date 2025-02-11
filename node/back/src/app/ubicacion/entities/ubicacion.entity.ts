import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Ubicacion extends Document {
  @Prop({ required: true })
  lat: number;

  @Prop({ required: true })
  long: number;

  @Prop({ default: Date.now }) 
  createdAt: Date;
}

export const UbicacionSchema = SchemaFactory.createForClass(Ubicacion);
