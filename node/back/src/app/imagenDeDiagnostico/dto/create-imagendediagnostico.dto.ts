import { IsString, IsDateString, IsEnum } from 'class-validator';

/**
 * DTO para la creación de una nueva imagen de diagnóstico
 */
export class CreateImagenDeDiagnosticoDto {
  /**
   * URL de la imagen
   */
  @IsString()
  url: string;

  /**
   * Fecha de creación de la imagen
   */
  @IsDateString()
  fecha_creacion: Date;

  /**
   * Descripción de la imagen
   */
  @IsString()
  descripcion: string;

  /**
   * Tipo de la imagen
   */
  @IsEnum(['normal', 'problema'])
  tipo: 'normal' | 'problema';
}
