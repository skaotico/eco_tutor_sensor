import { IsString } from 'class-validator';

/**
 * DTO para recibir los parámetros de entrada para obtener el diagrama de humedad.
 */
export class ObtenerDiagramaHumedadDto {
  fecha: string;

  @IsString({ message: 'El nombre común debe ser una cadena de caracteres.' })
  nombre_comun: string;
}
