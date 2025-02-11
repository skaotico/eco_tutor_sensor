import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosFactory } from '../axios/axios.factory';
import { OpenUVData } from './interface/open-uv-data.interface';
import { OpenuvServiceErrors } from './constants/openuv.service.constants';

@Injectable()
export class OpenuvService {
  private readonly axiosInstance;
  private readonly baseUrl: string;
  private readonly lat: string;
  private readonly lng: string;

  constructor(private configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('OPENUV_API_URL');
    this.lat = this.configService.get<string>('LATITUDE');
    this.lng = this.configService.get<string>('LONGITUDE');
    this.axiosInstance = AxiosFactory.createInstance(this.baseUrl);
  }

  /**
   * Obtiene los datos de la API OpenUV.
   *
   * @returns {Promise<OpenUVData>} La respuesta de la API OpenUV.
   * @throws {Error} Si no se puede obtener la información de la API.
   */
  async getOpenUVData(): Promise<OpenUVData> {
    try {
      const accessToken = this.configService.get<string>('ACCESS_TOKEN');
      if (!accessToken) {
        throw new Error(OpenuvServiceErrors.TOKEN_ERROR);
      }
      const url = `${this.baseUrl}?lat=${this.lat}&lng=${this.lng}&alt=100&dt=`;

      const curlCommand = `curl -X GET '${url}' -H 'x-access-token: ${accessToken}' -H 'Content-Type: application/json'`;
      // console.log('Generando comando curl:');
      // console.log(curlCommand);

      const headers = {
        'x-access-token': accessToken,
        'Content-Type': 'application/json',
      };

      const response = await this.axiosInstance.get(url, { headers });
      return response.data as OpenUVData;
    } catch (error) {
      console.error(OpenuvServiceErrors.FETCH_ERROR, error);
      throw new Error(OpenuvServiceErrors.FETCH_ERROR);
    }
  }
}
