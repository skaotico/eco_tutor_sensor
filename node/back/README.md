# Proyecto Eco Tutor Sensor

Este proyecto es una aplicación backend construida con NestJS que gestiona sensores, sectores, datos meteorológicos y más. La estructura del proyecto está organizada en módulos para facilitar el mantenimiento y la escalabilidad.

## Estructura del Proyecto

├── app
│   ├── arbol
│   │   ├── constants
│   │   ├── dto
│   │   └── schema
│   ├── axios
│   ├── common
│   │   ├── dto
│   │   └── filters
│   ├── cron
│   ├── database
│   ├── openuv
│   │   ├── constants
│   │   ├── dto
│   │   ├── interface
│   │   └── type
│   ├── sector
│   │   ├── dto
│   │   └── schema
│   ├── sensor
│   │   ├── dto
│   │   └── schema
│   ├── utils
│   └── weather
│       ├── constants
│       ├── enum
│       └── interface
└── img

## Descripción de Carpetas

- **app/**: Contiene todos los módulos y funcionalidades principales de la aplicación.
- **arbol/**: Módulo relacionado con árboles (constants, DTOs y esquemas).
- **axios/**: Configuración y servicios para realizar peticiones HTTP con Axios.
- **common/**: Funcionalidades comunes como DTOs y filtros globales.
- **cron/**: Tareas programadas con @nestjs/schedule.
- **database/**: Configuración y conexión a la base de datos.
- **openuv/**: Módulo para interactuar con la API de OpenUV (constants, DTOs, interfaces y tipos).
- **sector/**: Módulo para gestionar sectores (DTOs y esquemas).
- **sensor/**: Módulo para gestionar sensores (DTOs y esquemas).
- **utils/**: Utilidades y helpers reutilizables.
- **weather/**: Módulo para gestionar datos meteorológicos (constants, enums e interfaces).
- **img/**: Carpeta para almacenar imágenes relacionadas con el proyecto.

## Requisitos Previos

- **Node.js**: Versión 16 o superior.
- **npm**: Versión 7 o superior.
- **MongoDB**: Base de datos para almacenar la información.
- **API Key de OpenUV**: Si utilizas el módulo openuv, necesitarás una clave API.

## Instalación

1. Clona el repositorio:

    ```bash
    git clone https://github.com/tu-usuario/eco-tutor-sensor.git
    cd eco-tutor-sensor
    ```

2. Instala las dependencias:

    ```bash
    npm install
    ```

3. Configura las variables de entorno:  
    Crea un archivo `.env` en la raíz del proyecto y agrega las siguientes variables:

    ```
    MONGO_URI=mongodb://localhost:27017/eco_tutor_sensor
    PORT=3000
    OPENUV_API_KEY=tu_api_key_de_openuv
    ```

4. Compila el proyecto:

    ```bash
    npm run build
    ```

## Uso

- **Iniciar la aplicación en modo desarrollo**:

    ```bash
    npm run start:dev
    ```

- **Iniciar la aplicación en modo producción**:

    ```bash
    npm run start:prod
    ```

- **Acceder a la documentación de la API**:  
    Abre tu navegador y visita `http://localhost:3000/api` para ver la documentación generada por Swagger.

## Scripts Disponibles

- `npm run build`: Compila el proyecto.
- `npm run start`: Inicia la aplicación.
- `npm run start:dev`: Inicia la aplicación en modo desarrollo con recarga en caliente.
- `npm run start:prod`: Inicia la aplicación en modo producción.
- `npm run lint`: Ejecuta ESLint para verificar y corregir problemas de estilo.
- `npm run test`: Ejecuta las pruebas unitarias.
- `npm run test:e2e`: Ejecuta las pruebas end-to-end.

## Contribución

Si deseas contribuir a este proyecto, sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -am 'Añade nueva funcionalidad'`).
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

## Licencia

Este proyecto no tiene una licencia específica y está destinado únicamente para uso privado. No se permite la redistribución o el uso comercial sin permiso explícito.

## Contacto

Si tienes alguna pregunta o sugerencia, no dudes en contactarme en **yos.andrade@gmail.com**.