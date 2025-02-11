import { createCanvas, loadImage, CanvasRenderingContext2D } from 'canvas';
import {
  IMAGENES_FONDO,
  MENSAJES_ERROR,
  MENSAJES_INFO,
  MENSAJES_PROTECCION,
  URL_IMAGEN_PRINCIPAL,
} from './constants/image.constants';
import { CurrentWeather } from 'src/app/weather/interface/weather-data.interface';

export async function generarImagenUV(
  currentWeather: CurrentWeather,
  uvIndex: number,
): Promise<Buffer> {
  try {
    const width = 600;
    const height = 450;
    const canvas = createCanvas(width, height);
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

    // Cargar la imagen de fondo aleatoria
    const backgroundImageUrl =
      IMAGENES_FONDO[Math.floor(Math.random() * IMAGENES_FONDO.length)];
    const backgroundImage = await loadImage(backgroundImageUrl);
    ctx.drawImage(backgroundImage, 0, 0, width, height);

    // Cargar la imagen principal (logo)
    const image = await loadImage(URL_IMAGEN_PRINCIPAL);
    ctx.drawImage(image, (width - 100) / 2, 30, 100, 100); // Logo centrado, más espacio arriba

    // Título "Índice UV Actual"
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 30px "Helvetica Neue", Helvetica, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#000';
    ctx.strokeText(MENSAJES_INFO.INDICE_UV_ACTUAL, width / 2, 160); // Movemos el título
    ctx.fillText(MENSAJES_INFO.INDICE_UV_ACTUAL, width / 2, 160);

    // Detalles del UV
    ctx.textAlign = 'left'; // Alineación a la izquierda
    ctx.font = '20px "Helvetica Neue", Helvetica, Arial, sans-serif';
    ctx.fillText(`Factor UV: ${uvIndex.toFixed(1)}`, 30, 200); // Detalles del índice UV

    ctx.fillText(
      `Nivel de radiación: ${
        uvIndex < 3
          ? 'Bajo'
          : uvIndex < 6
            ? 'Moderado'
            : uvIndex < 8
              ? 'Alto'
              : 'Muy Alto'
      }`,
      30,
      230, // Reducido el espacio entre las secciones
    );

    // Información del clima actual
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 18px "Helvetica Neue", Helvetica, Arial, sans-serif';
    ctx.fillText(`Temperatura: ${currentWeather.temperature}°C`, 30, 270);
    ctx.fillText(`Velocidad viento: ${currentWeather.windspeed} km/h`, 30, 300);
    ctx.fillText(`Dirección viento: ${currentWeather.winddirection}°`, 30, 330);

    // Mensaje de protección según el índice UV
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 20px "Helvetica Neue", Helvetica, Arial, sans-serif';

    const mensajeProteccion =
      uvIndex < 3
        ? MENSAJES_PROTECCION[0]
        : uvIndex < 6
          ? MENSAJES_PROTECCION[1]
          : uvIndex < 8
            ? MENSAJES_PROTECCION[2]
            : MENSAJES_PROTECCION[3];

    ctx.fillText(mensajeProteccion, 30, 370); // Alineado a la izquierda

    // Pie de página con mensaje de generación
    ctx.font = 'italic 16px "Helvetica Neue", Helvetica, Arial, sans-serif';
    ctx.fillText(MENSAJES_INFO.GENERADO_POR, 30, height - 20); // Alineado a la izquierda

    return canvas.toBuffer();
  } catch (error) {
    console.error('Error al generar la imagen UV:', error);
    throw new Error(MENSAJES_ERROR.GENERAR_IMAGEN);
  }
}
