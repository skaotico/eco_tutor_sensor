import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Sensor extends Document {
  
  @Prop({ required: true })
  temperatura_ambiental: string;

  @Prop({ required: true })
  id_sensor: string;

  @Prop({ required: true })
  nombre_sensor: string;

  @Prop({ required: true })
  humedad: number;

  @Prop({ required: true })
  velocidad_viento: string;

  @Prop({ required: true })
  direccion_viento: string;

  @Prop({ required: true })
  es_dia: number;

  @Prop({ required: true })
  estado_clima: string;

  @Prop({ required: true })
  estado_uv: string;

  @Prop({ required: true })
  estado_uv_valor: number;

  @Prop({
    default: () =>
      new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000),
  })
  fecha: Date;
}

export const SensorSchema = SchemaFactory.createForClass(Sensor);
