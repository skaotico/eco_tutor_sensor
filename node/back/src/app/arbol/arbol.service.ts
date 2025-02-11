import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs/promises';
import { Arbol } from './schema/arbol.schema';
import { Sensor } from '../sensor/shema/sensor.schema';
import { Sector } from '../sector/shema/sector.schema';
import { ImagenDeDiagnostico } from '../imagendediagnostico/schema/imagenDeDiagnostico.schema';
import { ArbolDto } from './dto/create-arbol.dto';
import { EstadisticasArbolDto } from './dto/estadisticas-arbol.dto';
import { EstadisticasClimaDto } from './dto/estadisticas-clima.dto';
import { QrUtil } from '../utils/qr/qr.util';
import { ERRORES } from './constants/arbol-mensajes';
import { LecturasPorDiaDto } from './dto/lecturas-por-dia.dto';
import { DateTime } from 'luxon';
import {
  generateSensorChart,
  generateSensorChartBar,
  generateSensorChartBublle,
  generateSensorChartRadar,
} from '../utils/chart/chart.util';

@Injectable()
export class ArbolService {
  constructor(
    @InjectModel(Arbol.name) private readonly arbolModel: Model<Arbol>,
    @InjectModel(Sensor.name) private readonly sensorModel: Model<Sensor>,
    @InjectModel(Sector.name) private readonly sectorModel: Model<Sector>,
    @InjectModel(ImagenDeDiagnostico.name)
    private readonly imagendediagnosticoModule: Model<ImagenDeDiagnostico>,
  ) {}

  /**
   * Busca un árbol por su nombre común
   * @param nombre_comun - Nombre común del árbol
   * @param populate - Indica si se deben popular los sensores relacionados
   * @returns Promesa con el árbol encontrado
   * @throws NotFoundException si el árbol no existe
   */
  async buscarArbolPorNombre(
    nombre_comun: string,
    populate: boolean,
  ): Promise<Arbol> {
    const query = this.arbolModel.findOne({ nombre_comun });
    if (populate) {
      query.populate('sensores');
    } else {
      query.select('-sensores');
    }
    const arbol = await query.exec();
    if (!arbol) {
      throw new NotFoundException(
        `Árbol con nombre común ${nombre_comun} no encontrado`,
      );
    }
    return arbol;
  }

  /**
   * Obtiene todos los árboles con sus sensores relacionados
   * @returns Promesa con array de árboles
   */
  async listarTodosLosArboles(): Promise<Arbol[]> {
    return this.arbolModel.find().populate('sensores').exec();
  }

  /**
   * Encuentra un árbol específico por su nombre común
   * @param nombre_comun - Nombre común del árbol
   * @returns Promesa con el árbol encontrado
   */
  async findOne(nombre_comun: string): Promise<Arbol> {
    return await this.buscarArbolPorNombre(nombre_comun,true);
  }

  /**
   * Genera un código QR con la información del árbol
   * @param nombre_comun - Nombre común del árbol
   * @returns Promesa con el buffer del código QR
   */
  async generarQrPorNombreComun(nombre_comun: string): Promise<Buffer> {
    const arbol = await this.buscarArbolPorNombre(nombre_comun, false);
    console.log('arbol --', arbol);
    return QrUtil.generateQrBuffer(JSON.stringify(arbol));
  }

  /**
   * Actualiza un árbol por su ID
   * @param id - ID del árbol
   * @param data - Datos parciales del árbol para actualizar
   * @returns Promesa con el árbol actualizado
   * @throws NotFoundException si el árbol no existe
   */
  async update(id: string, data: Partial<Arbol>): Promise<Arbol> {
    const updatedArbol = await this.arbolModel
      .findByIdAndUpdate(id, data, { new: true })
      .populate('sensores')
      .exec();

    if (!updatedArbol) {
      throw new NotFoundException('Árbol no existe');
    }
    return updatedArbol;
  }

  /**
   * Elimina un árbol por su ID
   * @param id - ID del árbol
   * @throws NotFoundException si el árbol no existe
   */
  async delete(id: string): Promise<void> {
    const result = await this.arbolModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Árbol no existe');
    }
  }

  /**
   * Obtiene las estadísticas de humedad por árbol
   * @param nombre_comun - Nombre común del árbol
   * @returns Promesa con las estadísticas de humedad
   */
  async getHumedadByArbol(nombre_comun: string) {
    const arbol = await this.buscarArbolPorNombre(nombre_comun,true);

    const humedadPorDia = arbol.sensores.reduce((acc, sensor: Sensor) => {
      const fecha = sensor.fecha.toISOString().split('T')[0];
      if (!acc[fecha]) {
        acc[fecha] = [];
      }
      acc[fecha].push(sensor.humedad);
      return acc;
    }, {});

    return Object.entries(humedadPorDia).map(
      ([fecha, humedades]: [string, number[]]) => {
        const humedadMaxima = Math.max(...humedades);
        const humedadMinima = Math.min(...humedades);
        return {
          fecha,
          humedad_maxima: `${humedadMaxima}%`,
          humedad_minima: `${humedadMinima}%`,
          diferencia: humedadMaxima - humedadMinima,
        };
      },
    );
  }

  /**
   * Crea un nuevo árbol sin sensores
   * @param arbol - DTO con los datos del árbol
   * @returns Promesa con el árbol creado
   * @throws ConflictException si el árbol ya existe
   * @throws InternalServerErrorException si ocurre un error interno
   */
  async crearArbolSinSensores(arbol: ArbolDto): Promise<Arbol> {
    try {
      const arbolExistente = await this.arbolModel.findOne({
        nombre_comun: arbol.nombre_comun,
      });

      if (arbolExistente) {
        throw new ConflictException(ERRORES.CONFLICTO);
      }

      const nuevoArbol = new this.arbolModel({
        ...arbol,
        sensores: [],
      });

      return await nuevoArbol.save();
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(ERRORES.INTERNO, error.message);
    }
  }

  /**
   * Procesa las lecturas de sensores para obtener estadísticas
   * @param lecturas - Array de lecturas de sensores
   * @returns Objeto con las estadísticas procesadas
   */
  private procesarLecturasSensor(lecturas: EstadisticasClimaDto[]) {
    return lecturas.reduce(
      (acc, { temperatura, humedad, estadoClima, estadoUVValor, estadoUV }) => {
        // Temperatura
        if (temperatura > acc.mayorTemperatura) {
          acc.mayorTemperatura = temperatura;
          acc.estadoClimaMayorTemperatura = estadoClima;
        }
        if (temperatura < acc.menorTemperatura) {
          acc.menorTemperatura = temperatura;
          acc.estadoClimaMenorTemperatura = estadoClima;
        }

        // Humedad
        if (humedad > acc.mayorHumedad) {
          acc.mayorHumedad = humedad;
          acc.estadoClimaMayorHumedad = estadoClima;
        }
        if (humedad < acc.menorHumedad) {
          acc.menorHumedad = humedad;
          acc.estadoClimaMenorHumedad = estadoClima;
        }

        // UV
        if (estadoUVValor > acc.mayorUV) {
          acc.mayorUV = estadoUVValor;
          acc.estadoUVMayor = estadoUV;
        }

        return acc;
      },
      {
        mayorTemperatura: -Infinity,
        menorTemperatura: Infinity,
        estadoClimaMayorTemperatura: '',
        estadoClimaMenorTemperatura: '',
        mayorHumedad: -Infinity,
        menorHumedad: Infinity,
        estadoClimaMayorHumedad: '',
        estadoClimaMenorHumedad: '',
        mayorUV: -Infinity,
        estadoUVMayor: '',
      },
    );
  }

  /**
   * Obtiene estadísticas detalladas por nombre de árbol
   * @param nombre - Nombre común del árbol
   * @returns Promesa con array de estadísticas
   * @throws Error si hay un problema al obtener las estadísticas
   */
  async obtenerEstadisticasPorNombre(
    nombre: string,
  ): Promise<EstadisticasArbolDto[]> {
    try {
      const arbol = await this.buscarArbolPorNombre(nombre,true);
      const lecturasPorDia = new LecturasPorDiaDto();

      arbol.sensores.forEach((sensor) => {
        const fechaKey = sensor.fecha.toISOString().split('T')[0];
        lecturasPorDia.agregarLectura(fechaKey, {
          temperatura: parseFloat(
            sensor.temperatura_ambiental.replace(' °C', ''),
          ),
          humedad: sensor.humedad,
          estadoClima: sensor.estado_clima,
          estadoUVValor: sensor.estado_uv_valor,
          estadoUV: sensor.estado_uv,
        });
      });

      return lecturasPorDia
        .obtenerEntradas()
        .map(([fechaSaliente, lecturas]) => ({
          fechaSaliente,
          ...this.procesarLecturasSensor(lecturas),
        }));
    } catch (error) {
      throw new Error(`Error al obtener las estadísticas: ${error.message}`);
    }
  }

  /**
   * Genera un archivo Markdown con las estadísticas del árbol
   * @param nombreArbol - Nombre común del árbol
   * @throws Error si hay un problema al generar el archivo
   */
  async generarMd(nombreArbol: string): Promise<void> {
    try {
      const estadisticas = await this.obtenerEstadisticasPorNombre(nombreArbol);
      const imageUrl =
        'https://instagram.fscl29-1.fna.fbcdn.net/v/t51.2885-19/288885609_549093183561568_8783182692664535427_n.jpg?_nc_ht=instagram.fscl29-1.fna.fbcdn.net&_nc_cat=104&_nc_oc=Q6cZ2AFS0uMb02SDuUdmgUPaXJAwEEHctwWXFwYYb2TGw2lYpVCDOjOon0tvnwLXc6MW2Sg&_nc_ohc=0Jxxyp7QlSYQ7kNvgH6fAL5&_nc_gid=d1d90a64786547598191f0e949304bef&edm=AP4sbd4BAAAA&ccb=7-5&oh=00_AYC0bPFSBrNGQmYvkaB0JnsrvAD2JnGw1Ftp4IrAa2irhA&oe=67A176C1&_nc_sid=7a9f4b';

      const mdContent = this.generarContenidoMd(
        nombreArbol,
        estadisticas,
        imageUrl,
      );
      await fs.writeFile(`${nombreArbol}_estadisticas.md`, mdContent);
      console.log(
        `El archivo MD para el árbol ${nombreArbol} se ha generado correctamente.`,
      );
    } catch (error) {
      console.error('Error al generar el archivo MD:', error.message);
    }
  }

  /**
   * Genera el contenido del archivo Markdown
   * @param nombreArbol - Nombre común del árbol
   * @param estadisticas - Array de estadísticas del árbol
   * @param imageUrl - URL de la imagen a incluir
   * @returns String con el contenido del archivo Markdown
   */
  private generarContenidoMd(
    nombreArbol: string,
    estadisticas: EstadisticasArbolDto[],
    imageUrl: string,
  ): string {
    let mdContent = `# Estadísticas del Árbol: ${nombreArbol}\n\n`;
    mdContent += `<p align="center"><img src="${imageUrl}" alt="Eco Logo" width="400"/></p>\n\n`;

    estadisticas.forEach(
      ({
        fechaSaliente,
        estadoUVMayor,
        mayorTemperatura,
        menorTemperatura,
        estadoClimaMayorTemperatura,
        estadoClimaMenorTemperatura,
        mayorHumedad,
        menorHumedad,
      }) => {
        mdContent += `## Día: ${fechaSaliente}\n\n`;
        mdContent += `## Índice UV del Día: ${estadoUVMayor}\n\n`;
        mdContent += `**Mayor Temperatura:** ${mayorTemperatura}°C  
**Menor Temperatura:** ${menorTemperatura}°C  

**Estado Climático de la Mayor Temperatura:** ${estadoClimaMayorTemperatura}  
**Estado Climático de la Menor Temperatura:** ${estadoClimaMenorTemperatura}  

**Mayor Humedad:** ${mayorHumedad}%  
**Menor Humedad:** ${menorHumedad}%  

---

`;
      },
    );

    return mdContent;
  }

  /**
   * Obtiene el diagrama de humedad para un árbol en una fecha específica.
   * @param fechaBuscada Fecha que se desea buscar en formato ISO (YYYY-MM-DD).
   * @param nombre_comun Nombre común del árbol.
   * @returns Buffer con la imagen del diagrama generado.
   */
  async obtenerDiagramaHumedad(
    fechaBuscada: string,
    nombre_comun: string,
  ): Promise<Buffer> {
    try {
      // Convertir la fecha buscada a un objeto DateTime con zona horaria de Santiago.
      const date = DateTime.fromISO(fechaBuscada, { zone: 'America/Santiago' });

      if (!date.isValid) {
        throw new Error(`Fecha inválida: ${fechaBuscada}`);
      }

      // Formatear la fecha como 'YYYY-MM-DD' para comparar solo el día.
      const fechaFormateada = date.toFormat('yyyy-MM-dd');

      // Buscar el árbol por su nombre común y poblar los sensores.
      const arbol = await this.arbolModel
        .findOne({ nombre_comun })
        .populate('sensores');

      if (!arbol) {
        throw new NotFoundException(
          `Árbol con nombre "${nombre_comun}" no encontrado.`,
        );
      }

      // Obtener los IDs de los sensores asociados al árbol.
      const sensorIds = arbol.sensores.map((sensor) => sensor._id);

      if (sensorIds.length === 0) {
        throw new NotFoundException(
          `El árbol "${nombre_comun}" no tiene sensores.`,
        );
      }

      // Obtener todos los sensores relacionados con el árbol.
      const sensores = await this.sensorModel
        .find({
          _id: { $in: sensorIds },
        })
        .sort({ fecha: 1 });

      // Filtrar los sensores en memoria, comparando solo la fecha (sin hora).
      const sensoresFiltrados = sensores.filter((sensor) => {
        const fechaSensorFormateada = DateTime.fromJSDate(
          sensor.fecha,
        ).toFormat('yyyy-MM-dd');

        return fechaSensorFormateada === fechaFormateada;
      });

      if (sensoresFiltrados.length === 0) {
        throw new NotFoundException(
          `No hay datos de sensores para el árbol "${nombre_comun}" en la fecha ${fechaBuscada}.`,
        );
      }

      return generateSensorChartRadar(sensoresFiltrados, nombre_comun);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
