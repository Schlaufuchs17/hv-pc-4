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
  
  const io = new Server(httpServer, {
    cors: {
      origin: "*", 
      methods: ["GET", "POST"],
    },
    transports: ['websocket'],
  });

  io.on('connection', (socket) => {
    console.log('Usuario conectado con ID:', socket.id);

    socket.on('reconnect_attempt', (attempt) => {
      console.log(`Intento de reconexión número: ${attempt}`);
    });

    socket.on('chat message', (msg) => {
      console.log('Mensaje recibido en el servidor:', msg);
      io.emit('chat message', msg);
    });

    socket.on('disconnect', (reason) => {
      console.log('Usuario desconectado:', reason);
    });
  });

  server.all('*', (req, res) => handle(req, res));

  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
});
