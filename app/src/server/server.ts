import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Cambia esto si tienes restricciones de dominio.
    methods: ['GET', 'POST'],
  },
});

// Configurar eventos de conexión
io.on('connection', (socket) => {
  console.log(`Usuario conectado con ID: ${socket.id}`);

  // Manejar evento de mensaje
  socket.on('chat message', (msg) => {
    if (!msg?.text || !msg?.user) {
      console.error('Mensaje inválido recibido:', msg);
      return;
    }
    console.log('Mensaje recibido:', msg);

    // Enviar el mensaje a todos los clientes
    io.emit('chat message', msg);
  });

  // Manejar desconexión
  socket.on('disconnect', (reason) => {
    console.warn(`Usuario desconectado (${socket.id}): ${reason}`);
  });
});

// Iniciar el servidor
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
