import { Injectable } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { MENSAJES_ERROR } from '../utils/imagenes/constants/image.constants';
import { OpenuvService } from '../openuv/openuv.service';
import { WeatherService } from '../weather/weather.service';
import { generarImagenUV } from '../utils/imagenes/image-util';

/**
 * Servicio para manejar la generación de imágenes UV.
 */
@Injectable()
export class UVService {
  constructor(
    private readonly openuvService: OpenuvService,
    private readonly weatherService: WeatherService,
  ) {}

  /**
   * Obtiene una imagen con los datos de UV y clima actual.
   * @param {CurrentWeather} currentWeather Datos del clima actual.
   * @param {UVIndex} uvIndex Datos del índice UV.
   * @returns {Promise<Buffer>} Buffer de la imagen generada.
   * @throws {HttpException} Si ocurre un error al generar la imagen.
   */
  async obtenerImagenUV(): Promise<Buffer> {
    try {
      const currentWeather = await this.weatherService.getWeatherData();
      const dataUv = await this.openuvService.getOpenUVData();
      const uvIndex = dataUv.result.uv_max;
      const imagenBuffer = await generarImagenUV(currentWeather, uvIndex);
      return imagenBuffer;
    } catch (error) {
      console.error('Error en el servicio al generar la imagen UV:', error);
      throw new HttpException(
        MENSAJES_ERROR.GENERAR_IMAGEN,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
