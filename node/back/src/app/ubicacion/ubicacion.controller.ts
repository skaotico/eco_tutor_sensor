import { Controller } from '@nestjs/common';
import { UbicacionService } from './ubicacion.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('ubicacion')
@ApiTags('ubicacion')
export class UbicacionController {
  constructor(private readonly ubicacionService: UbicacionService) {}
}
