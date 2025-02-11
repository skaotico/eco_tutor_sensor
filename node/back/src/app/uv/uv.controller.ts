import { Controller, Get, Res } from '@nestjs/common';
import { UVService } from './uv.service';
import {
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
@Controller('uv')
@ApiTags('uv')
export class UvController {
  constructor(private readonly uvService: UVService) {}

  @Get()
  @ApiOperation({
    summary: 'Genera una imagen con el índice UV',
    description:
      'Este endpoint genera una imagen que muestra el índice UV basado en coordenadas predeterminadas (Santiago, Chile en este caso). No requiere parámetros de entrada.',
  })
  @ApiResponse({
    status: 200,
    description: 'Imagen generada correctamente',
    content: {
      'image/png': {
        schema: {
          type: 'string',
          format: 'binary',
        },
        examples: {
          example1: {
            value: 'Imagen PNG generada con los datos del índice UV',
          },
        },
      },
    },
  })
  @ApiProduces('image/png')
  @ApiProduces('image/png')
  async generarImagenUV(@Res() res: Response): Promise<void> {
    const imageBuffer = await this.uvService.obtenerImagenUV();

    const fechaActual = new Date().toISOString().replace(/[:.]/g, '-');

    res.setHeader('Content-Type', 'image/png');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="uv_image_${fechaActual}.png"`,
    );

    // Enviar la imagen como respuesta
    res.send(imageBuffer);
  }
}
