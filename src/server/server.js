import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = createServer(server);
  
  // Configuración de CORS en Socket.IO
  const io = new Server(httpServer, {
    cors: {
      origin: "*", // Permitir conexiones desde cualquier origen
      methods: ["GET", "POST"],
    },
    transports: ['websocket'], // Forzar el uso de WebSocket
  });

  io.on('connection', (socket) => {
    console.log('Usuario conectado con ID:', socket.id);

    // Verifica cada intento de reconexión
    socket.on('reconnect_attempt', (attempt) => {
      console.log(`Intento de reconexión número: ${attempt}`);
    });

    // Log para verificar que se recibe un mensaje
    socket.on('chat message', (msg) => {
      console.log('Mensaje recibido en el servidor:', msg);
      io.emit('chat message', msg); // Reenvía el mensaje a todos los clientes
    });

    socket.on('disconnect', (reason) => {
      console.log('Usuario desconectado:', reason);
    });
  });

  // Manejo de todas las demás rutas con Next.js
  server.all('*', (req, res) => handle(req, res));

  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
});
