import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ImagenDeDiagnostico } from './schema/imagenDeDiagnostico.schema';

@Injectable()
export class ImagendediagnosticoService {
  constructor(
    @InjectModel(ImagenDeDiagnostico.name)
    private readonly imagenDeDiagnosticoModel: Model<ImagenDeDiagnostico>,
  ) {}

  /**
   * Crea una nueva imagen de diagnóstico
   * @param {string} url - La URL de la imagen
   * @param {Date} fecha_creacion - La fecha de creación de la imagen
   * @param {string} descripcion - La descripción de la imagen
   * @param {'normal' | 'problema'} tipo - El tipo de la imagen
   * @returns {Promise<ImagenDeDiagnostico>}
   */
  async create(
    url: string,
    fecha_creacion: Date,
    descripcion: string,
    tipo: 'normal' | 'problema',
  ): Promise<ImagenDeDiagnostico> {
    const nuevaImagen = new this.imagenDeDiagnosticoModel({
      url,
      fecha_creacion,
      descripcion,
      tipo,
    });
    return nuevaImagen.save();
  }

  /**
   * Modifica el tipo de una imagen de diagnóstico
   * @param {string} id - El ID de la imagen a modificar
   * @param {'normal' | 'problema'} nuevoTipo - El nuevo tipo de la imagen
   * @returns {Promise<ImagenDeDiagnostico>}
   * @throws {NotFoundException} Si la imagen no se encuentra
   */
  async updateTipo(
    id: string,
    nuevoTipo: 'normal' | 'problema',
  ): Promise<ImagenDeDiagnostico> {
    const imagen = await this.imagenDeDiagnosticoModel.findById(id);
    if (!imagen) {
      throw new NotFoundException('Imagen de diagnóstico no encontrada');
    }
    imagen.tipo = nuevoTipo;
    return imagen.save();
  }
}
