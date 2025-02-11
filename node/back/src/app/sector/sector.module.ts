import { Module } from '@nestjs/common';
import { SectorService } from './sector.service';
import { SectorController } from './sector.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Sector, SectorSchema } from './shema/sector.schema';
import { Arbol, ArbolSchema } from '../arbol/schema/arbol.schema';
import { Sensor, SensorSchema } from '../sensor/shema/sensor.schema';
import { WeatherService } from '../weather/weather.service';
import { OpenuvService } from '../openuv/openuv.service';
import { ArbolService } from '../arbol/arbol.service';
import { ImagendediagnosticoService } from '../imagendediagnostico/imagendediagnostico.service';
import {
  ImagenDeDiagnostico,
  ImagenDeDiagnosticoSchema,
} from '../imagendediagnostico/schema/imagenDeDiagnostico.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Sector.name, schema: SectorSchema },
      { name: Arbol.name, schema: ArbolSchema },
      { name: Sensor.name, schema: SensorSchema },
      { name: ImagenDeDiagnostico.name, schema: ImagenDeDiagnosticoSchema },
    ]),
  ],
  controllers: [SectorController],
  providers: [
    SectorService,
    WeatherService,
    OpenuvService,
    ArbolService,
    ImagendediagnosticoService,
  ],
  exports: [SectorService, MongooseModule],
})
export class SectorModule {}
