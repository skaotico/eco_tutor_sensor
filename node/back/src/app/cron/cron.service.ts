import { Injectable } from '@nestjs/common';

import { OpenuvService } from '../openuv/openuv.service';

@Injectable()
export class CronService {
  constructor(private readonly openuvService: OpenuvService) {}

  //   @Cron('06 * * * *')
  //   async handleCron() {
  //     try {
  //       const openUVData = await this.openuvService.getOpenUVData();
  //       console.log('Datos obtenidos de OpenUV:', openUVData);
  //     } catch (error) {
  //       console.error('Error al obtener datos de OpenUV:', error);
  //     }
  //   }
}
