# Proyecto hv-pv-4

Este proyecto es una aplicación web desarrollada con **Next.js**, **TypeScript**, y **Tailwind CSS**. Utiliza **Socket.IO** para habilitar comunicación en tiempo real y **Express** para manejar el servidor en producción.

## Características Principales

- **Next.js**: Framework de React para aplicaciones web con renderizado en el servidor.
- **Tailwind CSS**: Framework de CSS para un diseño rápido y responsivo.
- **Socket.IO**: Comunicación en tiempo real entre el cliente y el servidor.
- **Express**: Servidor de Node.js que maneja la comunicación en producción.

## Instalación

1. Clona el repositorio:
   ```bash
   git clone <URL del repositorio>
   cd hv-pv-4
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo.
- `npm run build`: Genera la aplicación para producción.
- `npm start`: Inicia el servidor en modo de producción.
- `npm run lint`: Ejecuta el linter para analizar el código.

## Dependencias

### Principales
- `express`
- `next`
- `react`
- `react-dom`
- `socket.io`
- `socket.io-client`
- `webpack`

### Desarrollo
- `@types/node`
- `@types/react`
- `@types/react-dom`
- `eslint`
- `eslint-config-next`
- `postcss`
- `tailwindcss`
- `typescript`

## Estructura del Proyecto

- **pages/**: Páginas principales de la aplicación Next.js.
- **public/**: Archivos estáticos.
- **src/client/**: Archivos específicos del cliente, como fuentes y estilos.
- **src/server/**: Configuración y lógica del servidor.

## Uso

1. Ejecuta `npm run dev` para el modo de desarrollo.
2. Accede a la aplicación en `http://localhost:3000`.