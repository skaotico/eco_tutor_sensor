import { IsEnum } from 'class-validator';

/**
 * DTO para actualizar el tipo de una imagen de diagnóstico
 */
export class UpdateImagenDeDiagnosticoDto {
  /**
   * Tipo de la imagen
   */
  @IsEnum(['normal', 'problema'])
  tipo: 'normal' | 'problema';
}
