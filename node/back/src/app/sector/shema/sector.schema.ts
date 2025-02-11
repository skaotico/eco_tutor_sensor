import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Arbol } from 'src/app/arbol/schema/arbol.schema'; // Importar el esquema de Árbol
import { Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Sector extends Document {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  descripcion: string;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Arbol', default: [] })
  arboles: Arbol[];

  @Prop({ required: true, type: Date, default: Date.now })
  fechaCreacion: Date;

  @Prop({ type: Date, default: Date.now })
  fechaActualizacion: Date;

  @Prop({ type: [[Number]], default: [] })
  coordenadas: number[][];
}

export const SectorSchema = SchemaFactory.createForClass(Sector);
