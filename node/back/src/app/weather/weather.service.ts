import { Injectable } from '@nestjs/common';
import { AxiosFactory } from '../axios/axios.factory';
import { CurrentWeather } from './interface/weather-data.interface';
import { ConfigService } from '@nestjs/config';
import { WeatherServiceConstants } from './constants/weather.service.constants';

/**
 * Servicio que gestiona la obtención de datos de la API OpenUV.
 *
 * @author skaotico (Yosemar Andrade) - 26 de enero de 2025
 * @version 1.0.0
 */

@Injectable()
export class WeatherService {
  private readonly axiosInstance;
  private readonly baseUrl: string;

  /**
   * Crea una instancia del servicio de clima.
   *
   * @param {ConfigService} configService
   */
  constructor(private configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('OPEN_METEO_API_URL');
    this.axiosInstance = AxiosFactory.createInstance(this.baseUrl);
  }

  /**
   * Obtiene los datos del clima actual.
   *
   * @returns {Promise<CurrentWeather>} Los datos del clima actual.
   * @throws {Error} Si no se puede obtener la información.
   */
  async getWeatherData(): Promise<CurrentWeather> {
    try {
      const params = {
        latitude: String(-33.6136024),
        longitude: String(-70.5508398),
        current_weather: 'true',
        temperature_unit: 'celsius',
      };

      const url = `${this.baseUrl}?${new URLSearchParams(params).toString()}`;

      const response = await this.axiosInstance.get(url);
      const data = response.data;
      console.log();
      return data.current_weather;
    } catch (error) {
      console.error(WeatherServiceConstants.ERROR_MSG, error);
      throw new Error(WeatherServiceConstants.ERROR_MSG);
    }
  }
}
