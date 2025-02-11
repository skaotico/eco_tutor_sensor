import { Module } from '@nestjs/common';
import { UvController } from './uv.controller';
import { OpenuvService } from '../openuv/openuv.service';
import { WeatherService } from '../weather/weather.service';
import { UVService } from './uv.service';

@Module({
  controllers: [UvController],
  providers: [UVService, OpenuvService, WeatherService],
})
export class UvModule {}
