import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Put,
  Post,
  NotFoundException,
  Res,
  HttpException,
  HttpStatus,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { ArbolService } from './arbol.service';
import { Arbol } from './schema/arbol.schema';
import { ArbolDto } from './dto/create-arbol.dto';
import { ResponseDto } from '../common/dto/response.dto';
import { EstadisticasArbolDto } from './dto/estadisticas-arbol.dto';
import { ObtenerDiagramaHumedadDto } from './dto/obtener-diagrama-humedad.dto';
import { validate } from 'class-validator';

@ApiTags('Arbol')
@Controller('arbol')
export class ArbolController {
  constructor(private readonly arbolService: ArbolService) {}

  @Get('qr/:nombre_comun')
  async generarQrPorNombreComun(
    @Param('nombre_comun') nombre_comun: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      console.log('entre con el valor ', nombre_comun);
      const qrBuffer =
        await this.arbolService.generarQrPorNombreComun(nombre_comun);

      console.log('este es el buffer', qrBuffer);
      // Establecer el tipo de contenido y enviar el buffer
      res.setHeader('Content-Type', 'image/png'); // Cambiado de `res.set()`
      res.send(qrBuffer); // Cambiado de `res.send()`
    } catch (error) {
      throw new NotFoundException('Error al generar el QR');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los árboles' })
  @ApiResponse({
    status: 200,
    description: 'Lista de árboles',
    type: ResponseDto,
    isArray: false,
  })
  async listarTodosLosArboles(): Promise<ResponseDto<Arbol[]>> {
    try {
      const arboles = await this.arbolService.listarTodosLosArboles();
      return new ResponseDto<Arbol[]>(200, 'Operación exitosa', arboles);
    } catch (error) {
      throw new HttpException(
        'No se pudieron obtener los árboles',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // @Get(':nombre_comun')
  // @ApiOperation({ summary: 'Obtener un árbol por su nombre común' })
  // @ApiParam({ name: 'nombre_comun', description: 'Nombre común del árbol' })
  // @ApiResponse({ status: 200, description: 'Árbol encontrado', type: Arbol })
  // @ApiResponse({ status: 404, description: 'Árbol no encontrado' })
  // async findOne(nombre_comun: string): Promise<ResponseDto<Arbol>> {
  //   const arbol = this.arbolService.buscarArbolPorNombre(nombre_comun);
  //   return new ResponseDto<Arbol>(200, 'Operación exitosa', arbol);
  // }

  @Put(':nombre_comun')
  @ApiOperation({ summary: 'Actualizar un árbol por su nombre común' })
  @ApiParam({ name: 'nombre_comun', description: 'Nombre común del árbol' })
  @ApiResponse({ status: 200, description: 'Árbol actualizado', type: Arbol })
  @ApiResponse({ status: 404, description: 'Árbol no encontrado' })
  update(
    @Param('nombre_comun') nombre_comun: string,
    @Body() data: Partial<Arbol>,
  ): Promise<Arbol> {
    return this.arbolService.update(nombre_comun, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un árbol por su ID' })
  @ApiParam({ name: 'id', description: 'ID del árbol a eliminar' })
  @ApiResponse({ status: 200, description: 'Árbol eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Árbol no encontrado' })
  delete(@Param('id') id: string): Promise<void> {
    return this.arbolService.delete(id);
  }

  @Get(':nombre_comun/diferencias-humedad')
  @ApiOperation({ summary: 'Obtener diferencias de humedad para un árbol' })
  @ApiParam({ name: 'nombre_comun', description: 'Nombre común del árbol' })
  async getDiferenciasHumedad(
    @Param('nombre_comun') nombre_comun: string,
  ): Promise<any[]> {
    return this.arbolService.getHumedadByArbol(nombre_comun);
  }

  @Post('crear-sin-sensores')
  @ApiOperation({ summary: 'Crear un árbol sin sensores asociados' })
  @ApiBody({ type: ArbolDto })
  async crearArbolSinSensores(
    @Body() body: ArbolDto,
  ): Promise<ResponseDto<Arbol>> {
    const arbolCreado = await this.arbolService.crearArbolSinSensores(body);
    return new ResponseDto<Arbol>(
      200,
      'Árbol creado exitosamente',
      arbolCreado,
    );
  }

  @Get('nombre/:nombre/estadisticas')
  @ApiOperation({
    summary: 'Obtener estadísticas de temperatura y humedad para un árbol',
  })
  @ApiParam({ name: 'nombre', description: 'Nombre del árbol' })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas obtenidas exitosamente',
    type: [EstadisticasArbolDto],
  })
  async obtenerEstadisticas(
    @Param('nombre') nombre: string,
  ): Promise<ResponseDto<EstadisticasArbolDto[]>> {
    const data = await this.arbolService.obtenerEstadisticasPorNombre(nombre);
    await this.arbolService.generarMd(nombre);
    return new ResponseDto<EstadisticasArbolDto[]>(
      200,
      'estadísticas creadas exitosamente',
      data,
    );
  }

  /**
   * Obtiene el diagrama de humedad de un árbol en una fecha específica.
   *
   * @param {ObtenerDiagramaHumedadDto} obtenerDiagramaHumedadDto - DTO con los parámetros de entrada.
   * @returns {Promise<any>} Un objeto con los datos del diagrama de humedad.
   * @throws {BadRequestException} Si los parámetros son inválidos.
   * @throws {NotFoundException} Si no se encuentran datos.
   */
  @Get('diagrama-humedad')
  @ApiOperation({
    summary:
      'Obtiene el diagrama de humedad de un árbol en una fecha específica',
  })
  @ApiQuery({
    name: 'fecha',
    type: String,
    example: '2024-08-22',
    description: 'Fecha en formato ISO (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'nombre_comun',
    type: String,
    example: 'Roble',
    description: 'Nombre común del árbol',
  })
  @ApiResponse({
    status: 200,
    description: 'Diagrama de humedad generado correctamente',
  })
  @ApiResponse({ status: 400, description: 'Parámetros inválidos' })
  @ApiResponse({ status: 404, description: 'Datos no encontrados' })
  async obtenerDiagramaHumedad(
    @Query() obtenerDiagramaHumedadDto: ObtenerDiagramaHumedadDto,
    @Res() res: Response,
  ): Promise<any> {
    const { fecha, nombre_comun } = obtenerDiagramaHumedadDto;

    // Validación automática por DTO
    const errores = await validate(obtenerDiagramaHumedadDto);
    if (errores.length > 0) {
      throw new BadRequestException('Parámetros inválidos.');
    }

    const data = await this.arbolService.obtenerDiagramaHumedad(
      fecha,
      nombre_comun,
    );
    res.set({
      'Content-Type': 'image/png', // Cambiado a image/png para devolver una imagen
      'Content-Length': data.length,
      'Content-Disposition': 'inline; filename="diagrama-humedad.png"', // Cambiado a .png
    });

    res.send(data);
  }
}
