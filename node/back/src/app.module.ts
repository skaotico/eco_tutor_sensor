import { Module } from '@nestjs/common';
import { SensorModule } from './app/sensor/sensor.module';
import { DatabaseModule } from './app/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { SensorController } from './app/sensor/sensor.controller';
import { ArbolModule } from './app/arbol/arbol.module';
import { ArbolController } from './app/arbol/arbol.controller';
import { SectorModule } from './app/sector/sector.module';
import { WeatherService } from './app/weather/weather.service';
import { WeatherModule } from './app/weather/weather.module';
import { OpenuvModule } from './app/openuv/openuv.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './app/cron/cron.service';
import { CronModule } from './app/cron/cron.module';
import { UvModule } from './app/uv/uv.module';
import { CloudinaryModule } from './app/cloudinary/cloudinary.module';
import { CloudinaryController } from './app/cloudinary/cloudinary.controller';
import { UbicacionModule } from './app/ubicacion/ubicacion.module';
import { ImagendediagnosticoModule } from './app/imagenDeDiagnostico/imagendediagnostico.module';

/**
 * Módulo principal de la aplicación.
 * Configura el acceso a las variables de entorno y los módulos necesarios.
 */
@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SensorModule,
    DatabaseModule,
    ArbolModule,
    SectorModule,
    WeatherModule,
    OpenuvModule,
    CronModule,
    UvModule,
    CloudinaryModule,
    UbicacionModule,
    ImagendediagnosticoModule,
  ],
  controllers: [SensorController, ArbolController, CloudinaryController],
  providers: [WeatherService, CronService],
})
export class AppModule {}
