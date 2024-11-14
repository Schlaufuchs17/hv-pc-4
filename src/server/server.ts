import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import next from 'next';

const dev: boolean = process.env.NODE_ENV !== 'production';
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

  // Tipos específicos de socket y eventos
  io.on('connection', (socket: Socket) => {
    console.log('Usuario conectado con ID:', socket.id);

    socket.on('reconnect_attempt', (attempt: number) => {
      console.log(`Intento de reconexión número: ${attempt}`);
    });

    socket.on('chat message', (msg: string) => {
      console.log('Mensaje recibido en el servidor:', msg);
      io.emit('chat message', msg);
    });

    socket.on('disconnect', (reason: string) => {
      console.log('Usuario desconectado:', reason);
    });
  });

  // Definir tipos para req y res
  server.all('*', (req: Request, res: Response) => handle(req, res));

  const PORT: string | number = process.env.PORT || 3000;
  httpServer.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
});
