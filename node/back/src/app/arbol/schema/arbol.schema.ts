import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Sensor } from 'src/app/sensor/shema/sensor.schema';
import { Ubicacion } from 'src/app/ubicacion/entities/ubicacion.entity';
import { ImagenDeDiagnostico } from 'src/app/imagendediagnostico/schema/imagenDeDiagnostico.schema';
import { Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Arbol extends Document {
  @Prop({ required: true })
  nombre_comun: string;

  @Prop({ required: true })
  especie: string;

  @Prop({ required: true })
  descripcion: string;

  @Prop({ required: true })
  estado: string;

  @Prop({
    type: [MongooseSchema.Types.ObjectId],
    ref: 'Sensor',
    default: [],
  })
  sensores: Sensor[];

  @Prop({
    type: [MongooseSchema.Types.ObjectId],
    ref: 'Ubicacion',
    default: [],
  })
  ubicaciones: Ubicacion[];

  @Prop({
    type: [MongooseSchema.Types.ObjectId],
    ref: 'ImagenDeDiagnostico',
    default: [],
  })
  imagenes_de_diagnostico: ImagenDeDiagnostico[];
}

export const ArbolSchema = SchemaFactory.createForClass(Arbol);
