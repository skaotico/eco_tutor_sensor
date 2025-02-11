import { Controller, Post, Body, Param, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ImagendediagnosticoService } from './imagendediagnostico.service';
import { CreateImagenDeDiagnosticoDto } from './dto/create-imagendediagnostico.dto';
import { ImagenDeDiagnostico } from './schema/imagenDeDiagnostico.schema';
import { UpdateImagenDeDiagnosticoDto } from './dto/update-imagen-de-diagnostico.dto';

@ApiTags('Imagenes de Diagnóstico')
@Controller('imagenes-diagnostico')
export class ImagendediagnosticoController {
  constructor(
    private readonly imagenDeDiagnosticoService: ImagendediagnosticoService,
  ) {}

  /**
   * Crea una nueva imagen de diagnóstico
   * @param {CreateImagenDeDiagnosticoDto} createDto - DTO con los parámetros de la imagen
   * @returns {Promise<ImagenDeDiagnostico>}
   */
  @Post()
  @ApiOperation({ summary: 'Crear una nueva imagen de diagnóstico' })
  @ApiResponse({
    status: 201,
    description: 'Imagen de diagnóstico creada exitosamente',
    type: ImagenDeDiagnostico,
  })
  async create(
    @Body() createDto: CreateImagenDeDiagnosticoDto,
  ): Promise<ImagenDeDiagnostico> {
    return this.imagenDeDiagnosticoService.create(
      createDto.url,
      createDto.fecha_creacion,
      createDto.descripcion,
      createDto.tipo,
    );
  }

  /**
   * Modifica el tipo de una imagen de diagnóstico
   * @param {string} id - El ID de la imagen
   * @param {UpdateImagenDeDiagnosticoDto} updateDto - DTO con el nuevo tipo de la imagen
   * @returns {Promise<ImagenDeDiagnostico>}
   */
  @Put(':id/tipo')
  @ApiOperation({ summary: 'Modificar el tipo de una imagen de diagnóstico' })
  @ApiParam({
    name: 'id',
    description: 'ID de la imagen de diagnóstico',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de imagen modificado exitosamente',
    type: ImagenDeDiagnostico,
  })
  @ApiResponse({
    status: 404,
    description: 'Imagen de diagnóstico no encontrada',
  })
  async updateTipo(
    @Param('id') id: string,
    @Body() updateDto: UpdateImagenDeDiagnosticoDto,
  ): Promise<ImagenDeDiagnostico> {
    return this.imagenDeDiagnosticoService.updateTipo(id, updateDto.tipo);
  }
}
