import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateSectorDto } from './dto/create-sector.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Sector } from './shema/sector.schema';
import { Arbol } from '../arbol/schema/arbol.schema';
import { Model } from 'mongoose';
import { Sensor } from '../sensor/shema/sensor.schema';
import { CreateSensorDto } from '../sensor/dto/create-sensor.dto';
import { WeatherService } from '../weather/weather.service';
import { CodigoClima } from '../weather/enum/codigo-clima.enum';
import { OpenuvService } from '../openuv/openuv.service';
import * as fs from 'fs';
import { obtenerDireccion } from '../utils/viento.util';
import { ArbolService } from '../arbol/arbol.service';

@Injectable()
export class SectorService {
  constructor(
    @InjectModel(Sector.name) private readonly sectorModel: Model<Sector>,
    @InjectModel(Arbol.name) private readonly arbolModel: Model<Arbol>,
    @InjectModel(Sensor.name) private readonly sensorModel: Model<Sensor>,
    private readonly weatherService: WeatherService,
    private readonly openuvService: OpenuvService,
    private readonly arbolService: ArbolService,
  ) {}
  async create(createSectorDto: CreateSectorDto): Promise<Sector> {
    const arbolesIds = await Promise.all(
      createSectorDto.arboles?.map(async (arbol) => {
        let arbolEncontrado = await this.arbolModel.findOne({
          nombre_comun: arbol.nombre_comun,
        });

        if (!arbolEncontrado) {
          const sensoresIds = await Promise.all(
            arbol.sensores?.map(async (sensor) => {
              const nuevoSensor = await this.sensorModel.create(sensor);
              return nuevoSensor._id;
            }) || [],
          );

          arbolEncontrado = await this.arbolModel.create({
            nombre_comun: arbol.nombre_comun,
            descripcion: arbol.descripcion,
            especie: arbol.especie,
            sensores: sensoresIds,
          });
        }

        return arbolEncontrado._id;
      }) || [],
    );

    const sector = new this.sectorModel({
      ...createSectorDto,
      arboles: arbolesIds,
    });

    return sector.save();
  }

  async findAll(): Promise<Sector[]> {
    try {
      return await this.sectorModel
        .find()
        .populate({
          path: 'arboles',
          populate: {
            path: 'sensores',
          },
        })
        .exec();
    } catch (error) {
      console.error('Error fetching sectors:', error);
      throw new InternalServerErrorException('Failed to fetch sectors');
    }
  }

  async findOne(id: string): Promise<Sector> {
    return this.sectorModel.findById(id).populate('arboles').exec();
  }

  async remove(id: string): Promise<Sector> {
    return this.sectorModel.findByIdAndDelete(id).exec();
  }

  async addSensorsToTree(
    sectorName: string,
    treeName: string,
    sensorsDto: CreateSensorDto[],
  ) {
    try {
      const sector = await this.sectorModel
        .findOne({ nombre: sectorName })
        .populate('arboles');

      if (!sector) {
        throw new NotFoundException('Sector no encontrado');
      }

      const tree = sector.arboles.find(
        (arbol) => arbol.nombre_comun === treeName,
      );

      if (!tree) {
        throw new NotFoundException(
          `Árbol con nombre "${treeName}" no encontrado`,
        );
      }

      const sensors = await Promise.all(
        sensorsDto.map(async (sensorDto) => {
          // const resultUv = await this.openuvService.getOpenUVData();
          // console.log(resultUv);
          const temp = await this.weatherService.getWeatherData();
          const direccionViento = obtenerDireccion(temp.winddirection);

          if (!temp || !temp.temperature) {
            throw new Error('Temperature data is missing');
          }

          const sensor = new this.sensorModel({
            temperatura_ambiental: temp.temperature + ' °C',
            id_sensor: sensorDto.id_sensor,
            nombre_sensor: sensorDto.nombre_sensor,
            humedad: sensorDto.humedad,
            velocidad_viento: temp.windspeed + ' m/s',
            direccion_viento: direccionViento.toString(),
            es_dia: temp.is_day,
            estado_clima: CodigoClima[temp.weathercode],
            estado_uv_valor: 0, //resultUv.result.uv,
            estado_uv: 'no informado',
            fecha:
              sensorDto.fecha ||
              new Date(
                new Date().getTime() - new Date().getTimezoneOffset() * 60000,
              ),
          });

          try {
            await sensor.save();
          } catch (err) {
            console.error('Error al guardar el sensor:', err);
            throw new Error('Error al agregar el sensor al árbol');
          }

          return sensor;
        }),
      );

      tree.sensores.push(...sensors);

      await tree.save();

      await sector.save();

      return sector;
    } catch (error) {
      console.error('Error al agregar sensores al árbol:', error);
      throw new InternalServerErrorException(
        'Hubo un problema al agregar los sensores al árbol',
      );
    }
  }

  /**
   * Agrega un árbol a un sector dado su nombre.
   *
   * @param {string} nombreSector - Nombre del sector donde se agregará el árbol.
   * @param {string} nombreArbol - Nombre común del árbol a agregar.
   * @returns {Promise<Sector>} El sector actualizado con el árbol agregado.
   * @throws {NotFoundException} Si el árbol o el sector no se encuentran.
   * @throws {Error} Si el árbol ya está presente en otro sector.
   */
  async agregarArbolASectorPorNombre(
    nombreSector: string,
    nombreArbol: string,
  ): Promise<Sector> {
    const arbol = (await this.arbolModel
      .findOne({ nombre_comun: nombreArbol })
      .exec()) as Arbol;
    if (!arbol) {
      throw new NotFoundException(
        `Árbol con nombre "${nombreArbol}" no encontrado`,
      );
    }

    const sector = await this.sectorModel
      .findOne({ nombre: nombreSector })
      .populate('arboles')
      .exec();

    if (!sector) {
      throw new NotFoundException(
        `Sector con nombre "${nombreSector}" no encontrado`,
      );
    }
    const arbolObj = arbol.toObject();
    // console.log(arbolObj._id);

    const sectorConArbol = await this.sectorModel
      .findOne({ arboles: arbolObj._id })
      .exec();

    if (sectorConArbol) {
      throw new Error(
        `El árbol "${nombreArbol}" no se encuentra en el sector "${sectorConArbol.nombre}"`,
      );
    }

    sector.arboles.push(arbol.toObject()._id);
    await sector.save();

    return sector;
  }

  // async agregarArbolPorNombreSector(
  //   nombreSector: string,
  //   nombreArbol: string,
  // ): Promise<Sector> {
  //   const sector = await this.sectorModel.findOne({ nombre: nombreSector });
  //   if (!sector) {
  //     throw new NotFoundException(
  //       `Sector con nombre '${nombreSector}' no encontrado`,
  //     );
  //   }
  //   const arbol: Arbol = await this.arbolModel
  //     .findOne({ nombre_comun: nombreArbol })
  //     .exec();
  //   if (!arbol) {
  //     throw new NotFoundException(
  //       `Árbol con nombre '${nombreArbol}' no encontrado`,
  //     );
  //   }

  //   // if (!sector.arboles.includes(arbol._id)) {
  //   //   sector.arboles.push(arbol._id);
  //   //   await sector.save();
  //   // }
  //   // return sector;
  // }
  /**
   * Genera un informe en formato Markdown sobre el estado de los árboles en cada sector del ecoparque.
   * Incluye un resumen de la cantidad total de árboles y las estadísticas de cada árbol.
   * También muestra las fechas de creación y actualización de cada sector, colocadas debajo del título del sector.
   *
   * @returns {Promise<void>} Promesa que se resuelve cuando el informe se genera correctamente.
   */
  async generarInformeMD(): Promise<void> {
    const sectores = await this.findAll();
    let contenido = '';

    // Título del documento
    contenido +=
      '# 🌳 **Informe de Estado de los Árboles en el Ecoparque** 🌿\n\n';
    contenido +=
      'Este informe proporciona una visión detallada de los árboles en cada sector del ecoparque.\n\n';
    contenido += '---\n\n';

    const totalArboles = sectores.reduce(
      (total, sector) => total + sector.arboles.length,
      0,
    );
    contenido += `## **Total de Árboles en el Ecoparque: ${totalArboles}** 🌳\n\n`;

    // Iterar sobre los sectores
    for (const sector of sectores) {
      contenido += `# 🏞️ **${sector.nombre}**\n\n`;
      contenido += `**Descripción:** ${sector.descripcion}\n\n`;

      // Agregar las fechas debajo del sector
      contenido += `📅 **Fecha de Creación:** ${new Date(sector.fechaCreacion).toLocaleDateString()}\n`;
      contenido += `📆 **Última Actualización:** ${new Date(sector.fechaActualizacion).toLocaleDateString()}\n\n`;

      const cantidadArboles = sector.arboles.length;
      contenido += `## **Cantidad de árboles en este sector: ${cantidadArboles}** 🌱\n\n`;

      if (cantidadArboles > 0) {
        contenido +=
          '| 🌳 Árbol | 📝 Descripción | 📊 Lecturas Sensores | 🌡️ Mayor Temp | 🌡️ Menor Temp | 🌤️ Clima Mayor Temp | 🌤️ Clima Menor Temp | 💧 Mayor Humedad | 💧 Menor Humedad | 🌦️ Clima Mayor Humedad | 🌦️ Clima Menor Humedad | ☀️ UV Mayor |\n';
        contenido +=
          '|---------|-------------|------------------|--------------|--------------|----------------|-----------------|---------------|---------------|--------------------|---------------------|----------|\n';

        for (const arbol of sector.arboles) {
          const cantidadLecturasSensores = arbol.sensores.length;

          const estadisticas =
            await this.arbolService.obtenerEstadisticasPorNombre(
              arbol.nombre_comun,
            );

          const estadistica = estadisticas.length > 0 ? estadisticas[0] : null;

          contenido += `| 🌳 ${arbol.nombre_comun} (${arbol.especie}) | ${arbol.descripcion.replace(/\n/g, ' ')} | ${cantidadLecturasSensores} | `;

          if (estadistica) {
            contenido += `${estadistica.mayorTemperatura}°C | ${estadistica.menorTemperatura}°C | ${estadistica.estadoClimaMayorTemperatura} | ${estadistica.estadoClimaMenorTemperatura} | `;
            contenido += `${estadistica.mayorHumedad}% | ${estadistica.menorHumedad}% | ${estadistica.estadoClimaMayorHumedad} | ${estadistica.estadoClimaMenorHumedad} | ${estadistica.estadoUVMayor} |\n`;
          } else {
            contenido += 'N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A |\n';
          }
        }
      } else {
        contenido += '🌱 **No hay árboles en este sector.**\n\n';
      }
      contenido += '---\n\n';
    }

    // Pie de página
    contenido += '\n\n---\n';
    contenido +=
      '_📌 Generado automáticamente por el equipo tecnológico de Ecoparque._ 🌳\n';

    fs.writeFileSync('informe_sector.md', contenido, 'utf8');
    console.log('✅ Informe generado con éxito!');
  }
}
