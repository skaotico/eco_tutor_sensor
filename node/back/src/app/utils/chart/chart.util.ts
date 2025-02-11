import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { DateTime } from 'luxon';
import { Sensor } from 'src/app/sensor/shema/sensor.schema';
import { ChartConfiguration } from 'chart.js'; // Asegúrate de importar ChartConfiguration correctamente
import { ChartOptions } from 'chart.js';
const chartJSNodeCanvas = new ChartJSNodeCanvas({
  width: 1900,
  height: 800,
  backgroundColour: 'white',
});

// export async function generateSensorChart(
//   sensores: Sensor[],
//   nombre_comun: string,
// ): Promise<Buffer> {
//   const labels = sensores.map((s) => {
//     const date = DateTime.fromJSDate(s.fecha)
//       .setZone('America/Santiago')
//       .plus({ hours: 3 });
//     return date.toFormat('HH:mm:ss');
//   });

//   const humedadData = sensores.map((s) => s.humedad);

//   // Verificamos si hay un valor por debajo del 30% para generar la línea roja
//   const hasBelow30 = humedadData.some((humedad) => humedad < 30);

//   const configuration: ChartConfiguration = {
//     type: 'line' as const,
//     data: {
//       labels,
//       datasets: [
//         {
//           label: 'Humedad del Suelo (%)',
//           data: humedadData,
//           borderColor: 'blue',
//           fill: false,
//         },
//       ],
//     },
//     options: {
//       responsive: true,
//       plugins: {
//         title: {
//           display: true,
//           text: `Lecturas de Sensores: 1 Día, Actualización Cada 30 Segundos, ${nombre_comun}`,
//         },
//         tooltip: {
//           callbacks: {
//             label: (tooltipItem) => {
//               return `Valor: ${tooltipItem.raw} ${tooltipItem.dataset.label}`;
//             },
//           },
//         },
//       },
//       scales: {
//         x: {
//           title: {
//             display: true,
//             text: 'Hora del Día',
//           },
//         },
//         y: {
//           title: {
//             display: true,
//             text: 'Humedad (%)',
//           },
//           min: 0, // Aseguramos que el eje Y comience en 0
//           max: 100, // Aseguramos que el eje Y termine en 100
//         },
//       },
//       annotation: hasBelow30
//         ? {
//             annotations: [
//               {
//                 type: 'line',
//                 mode: 'horizontal',
//                 scaleID: 'y',
//                 value: 30,
//                 borderColor: 'red',
//                 borderWidth: 2,
//                 label: {
//                   enabled: true,
//                   content: 'Límite 30%',
//                   position: 'right',
//                   backgroundColor: 'white',
//                 },
//               },
//             ],
//           }
//         : {},
//     } as ChartOptions, // Aquí usamos `ChartOptions` como tipo
//   };

//   return await chartJSNodeCanvas.renderToBuffer(configuration);
// }
export async function generateSensorChart(
  sensores: Sensor[],
  nombre_comun: string,
): Promise<Buffer> {
  const labels = sensores.map((s) => {
    const date = DateTime.fromJSDate(s.fecha)
      .setZone('America/Santiago')
      .plus({ hours: 3 });
    return date.toFormat('HH:mm:ss');
  });

  const humedadData = sensores.map((s) => s.humedad);

  const configuration: ChartConfiguration = {
    type: 'line' as const,
    data: {
      labels,
      datasets: [
        {
          label: 'Humedad del Suelo (%)',
          data: humedadData,
          borderColor: 'blue',
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: `Lecturas de Sensores: 1 Día, Actualización Cada 30 Segundos, ${nombre_comun}`,
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem) => {
              return `Valor: ${tooltipItem.raw} ${tooltipItem.dataset.label}`;
            },
          },
        },
        footer: {
          display: true,
          text: `Generado el ${DateTime.local().setZone('America/Santiago').toFormat('dd/MM/yyyy HH:mm:ss')}`,
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Hora del Día',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Humedad (%)',
          },
          min: 0,
          max: 100,
        },
      },
    } as ChartOptions,
  };

  return await chartJSNodeCanvas.renderToBuffer(configuration);
}

export async function generateSensorChartBar(
  sensores: Sensor[],
  nombre_comun: string,
): Promise<Buffer> {
  const labels = sensores.map((s) => {
    const date = DateTime.fromJSDate(s.fecha)
      .setZone('America/Santiago')
      .plus({ hours: 3 });
    return date.toFormat('HH:mm:ss');
  });

  const humedadData = sensores.map((s) => s.humedad);

  const hasBelow30 = humedadData.some((humedad) => humedad < 30);

  const configuration: ChartConfiguration = {
    type: 'bar' as const,
    data: {
      labels,
      datasets: [
        {
          label: 'Humedad del Suelo (%)',
          data: humedadData,
          backgroundColor: 'blue',
          borderColor: 'blue',
          borderWidth: 1,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: `Lecturas de Sensores: 1 Día, Actualización Cada 30 Segundos, ${nombre_comun}`,
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem) => {
              return `Valor: ${tooltipItem.raw} ${tooltipItem.dataset.label}`;
            },
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Hora del Día',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Humedad (%)',
          },
          min: 0,
          max: 100,
        },
      },
      annotation: hasBelow30
        ? {
            annotations: [
              {
                type: 'line',
                mode: 'horizontal',
                scaleID: 'y',
                value: 30,
                borderColor: 'red',
                borderWidth: 2,
                label: {
                  enabled: true,
                  content: 'Límite 30%',
                  position: 'right',
                  backgroundColor: 'white',
                },
              },
            ],
          }
        : {},
    } as ChartOptions,
  };

  return await chartJSNodeCanvas.renderToBuffer(configuration);
}
export async function generateSensorChartRadar(
  sensores: Sensor[],
  nombre_comun: string,
): Promise<Buffer> {
  const labels = sensores.map((s) => {
    const date = DateTime.fromJSDate(s.fecha)
      .setZone('America/Santiago')
      .plus({ hours: 3 });
    return date.toFormat('HH:mm:ss');
  });

  const humedadData = sensores.map((s) => s.humedad);

  // Verificamos si hay un valor por debajo del 30% para generar la línea roja
  const hasBelow30 = humedadData.some((humedad) => humedad < 30);

  const configuration: ChartConfiguration = {
    type: 'radar' as const, // Cambié 'line' a 'radar'
    data: {
      labels,
      datasets: [
        {
          label: 'Humedad del Suelo (%)',
          data: humedadData,
          borderColor: 'blue',
          backgroundColor: 'rgba(0, 0, 255, 0.2)', // Para radar, el fondo suele ser semitransparente
          borderWidth: 2,
          fill: true, // Se rellena el área bajo la línea
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: `Lecturas de Sensores: 1 Día, Actualización Cada 30 Segundos, ${nombre_comun}`,
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem) => {
              return `Valor: ${tooltipItem.raw} ${tooltipItem.dataset.label}`;
            },
          },
        },
      },
      scales: {
        r: {
          min: 0, // Aseguramos que el radar comience en 0
          max: 100, // Aseguramos que el radar termine en 100
          angleLines: {
            display: false, // Desactivamos las líneas de ángulo
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)', // Color de la cuadrícula
          },
          ticks: {
            stepSize: 20, // Establecemos el tamaño de los pasos
          },
        },
      },
      annotation: hasBelow30
        ? {
            annotations: [
              {
                type: 'line',
                mode: 'horizontal',
                scaleID: 'r',
                value: 30,
                borderColor: 'red',
                borderWidth: 2,
                label: {
                  enabled: true,
                  content: 'Límite 30%',
                  position: 'right',
                  backgroundColor: 'white',
                },
              },
            ],
          }
        : {},
    } as ChartOptions,
  };

  return await chartJSNodeCanvas.renderToBuffer(configuration);
}

export async function generateSensorChartDoughnut(
  sensores: Sensor[],
  nombre_comun: string,
): Promise<Buffer> {
  const labels = sensores.map((s) => {
    const date = DateTime.fromJSDate(s.fecha)
      .setZone('America/Santiago')
      .plus({ hours: 3 });
    return date.toFormat('HH:mm:ss');
  });

  const humedadData = sensores.map((s) => s.humedad);

  // Verificamos si hay un valor por debajo del 30% para generar la línea roja
  const hasBelow30 = humedadData.some((humedad) => humedad < 30);

  const configuration: ChartConfiguration = {
    type: 'doughnut' as const, // Cambié 'line' a 'doughnut'
    data: {
      labels,
      datasets: [
        {
          label: 'Humedad del Suelo (%)',
          data: humedadData,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'], // Colores diferentes para las secciones
          borderColor: 'white',
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: `Lecturas de Sensores: 1 Día, Actualización Cada 30 Segundos, ${nombre_comun}`,
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem) => {
              return `Valor: ${tooltipItem.raw} ${tooltipItem.dataset.label}`;
            },
          },
        },
      },
      cutout: '70%', // Ajusta el tamaño del agujero central
      rotation: Math.PI, // Inicia el gráfico desde el ángulo de 180 grados
      animation: {
        animateRotate: true, // Habilita la animación al rotar
        animateScale: true, // Habilita la animación al cambiar de tamaño
      },
      annotation: hasBelow30
        ? {
            annotations: [
              {
                type: 'line',
                mode: 'horizontal',
                scaleID: 'y',
                value: 30,
                borderColor: 'red',
                borderWidth: 2,
                label: {
                  enabled: true,
                  content: 'Límite 30%',
                  position: 'right',
                  backgroundColor: 'white',
                },
              },
            ],
          }
        : {},
    } as ChartOptions,
  };

  return await chartJSNodeCanvas.renderToBuffer(configuration);
}

export async function generateSensorChartPie(
  sensores: Sensor[],
  nombre_comun: string,
): Promise<Buffer> {
  const labels = sensores.map((s) => {
    const date = DateTime.fromJSDate(s.fecha)
      .setZone('America/Santiago')
      .plus({ hours: 3 });
    return date.toFormat('HH:mm:ss');
  });

  const humedadData = sensores.map((s) => s.humedad);

  // Verificamos si hay un valor por debajo del 30% para generar la línea roja
  const hasBelow30 = humedadData.some((humedad) => humedad < 30);

  const configuration: ChartConfiguration = {
    type: 'pie' as const, // Cambié 'line' a 'pie'
    data: {
      labels,
      datasets: [
        {
          label: 'Humedad del Suelo (%)',
          data: humedadData,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'], // Colores diferentes para las secciones
          borderColor: 'white',
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: `Lecturas de Sensores: 1 Día, Actualización Cada 30 Segundos, ${nombre_comun}`,
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem) => {
              return `Valor: ${tooltipItem.raw} ${tooltipItem.dataset.label}`;
            },
          },
        },
      },
      animation: {
        animateRotate: true,
        animateScale: true,
      },
      annotation: hasBelow30
        ? {
            annotations: [
              {
                type: 'line',
                mode: 'horizontal',
                scaleID: 'y',
                value: 30,
                borderColor: 'red',
                borderWidth: 2,
                label: {
                  enabled: true,
                  content: 'Límite 30%',
                  position: 'right',
                  backgroundColor: 'white',
                },
              },
            ],
          }
        : {},
    } as ChartOptions,
  };

  return await chartJSNodeCanvas.renderToBuffer(configuration);
}

export async function generateSensorChartBublle(
  sensores: Sensor[],
  nombre_comun: string,
): Promise<Buffer> {
  const labels = sensores.map((s) => {
    const date = DateTime.fromJSDate(s.fecha)
      .setZone('America/Santiago')
      .plus({ hours: 3 });
    return date.toFormat('HH:mm:ss');
  });

  const humedadData = sensores.map((s) => s.humedad);

  // Verificamos si hay un valor por debajo del 30% para generar la línea roja
  const hasBelow30 = humedadData.some((humedad) => humedad < 30);

  type BubbleData = {
    x: number;
    y: number;
    r: number;
  };

  const configuration: ChartConfiguration = {
    type: 'bubble' as const, // Cambié 'line' a 'bubble'
    data: {
      labels,
      datasets: [
        {
          label: 'Humedad del Suelo (%)',
          data: sensores.map((s) => ({
            x: DateTime.fromJSDate(s.fecha)
              .setZone('America/Santiago')
              .plus({ hours: 3 })
              .toMillis(), // Usamos milisegundos para el eje X
            y: s.humedad,
            r: 5, // Radio del círculo (puedes ajustar el tamaño)
          })),
          backgroundColor: 'rgba(0, 123, 255, 0.6)', // Color de las burbujas
          borderColor: 'rgba(0, 123, 255, 1)', // Color del borde de las burbujas
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: `Lecturas de Sensores: 1 Día, Actualización Cada 30 Segundos, ${nombre_comun}`,
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem) => {
              const raw = tooltipItem.raw as BubbleData; // Hacemos un cast a BubbleData
              return `Valor: ${raw.y} ${tooltipItem.dataset.label}`;
            },
          },
        },
      },
      scales: {
        x: {
          type: 'time', // Usamos un eje de tiempo en el eje X
          time: {
            unit: 'minute',
            tooltipFormat: 'll HH:mm:ss',
          },
          title: {
            display: true,
            text: 'Hora del Día',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Humedad (%)',
          },
          min: 0,
          max: 100,
        },
      },
      annotation: hasBelow30
        ? {
            annotations: [
              {
                type: 'line',
                mode: 'horizontal',
                scaleID: 'y',
                value: 30,
                borderColor: 'red',
                borderWidth: 2,
                label: {
                  enabled: true,
                  content: 'Límite 30%',
                  position: 'right',
                  backgroundColor: 'white',
                },
              },
            ],
          }
        : {},
    } as ChartOptions,
  };

  return await chartJSNodeCanvas.renderToBuffer(configuration);
}
