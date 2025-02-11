import { EstadisticasClimaDto } from './estadisticas-clima.dto';
import { IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class LecturasPorDiaDto {
  @IsObject()
  @ValidateNested()
  @Type(() => EstadisticasClimaDto)
  private lecturas: Record<string, EstadisticasClimaDto[]> = {};

  agregarLectura(fecha: string, lectura: EstadisticasClimaDto): void {
    if (!this.lecturas[fecha]) {
      this.lecturas[fecha] = [];
    }
    this.lecturas[fecha].push(lectura);
  }

  obtenerLecturasPorFecha(fecha: string): EstadisticasClimaDto[] {
    return this.lecturas[fecha] || [];
  }

  obtenerTodasLasLecturas(): Record<string, EstadisticasClimaDto[]> {
    return this.lecturas;
  }

  obtenerEntradas(): [string, EstadisticasClimaDto[]][] {
    return Object.entries(this.lecturas);
  }
}
