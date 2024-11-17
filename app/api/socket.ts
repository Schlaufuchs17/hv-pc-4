import { NextApiRequest } from 'next';
import { ExtendedResponse, ExtendedServer } from '@/types/socket'; // Importación desde el archivo de tipos
import { Server as SocketIOServer } from 'socket.io';

let io: SocketIOServer | undefined;

export default function handler(req: NextApiRequest, res: ExtendedResponse) {
  if (!res.socket.server.io) {
    console.log('Inicializando Socket.IO...');

    const httpServer: ExtendedServer = res.socket.server;
    io = new SocketIOServer(httpServer, {
      path: '/api/socket',
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket) => {
      console.log(`Usuario conectado: ${socket.id}`);

      socket.on('chat message', (msg) => {
        if (msg?.text && msg?.user) {
          console.log('Mensaje recibido:', msg);
          io?.emit('chat message', msg);
        } else {
          console.error('Mensaje inválido recibido:', msg);
        }
      });

      socket.on('disconnect', (reason) => {
        console.log(`Usuario desconectado (${socket.id}): ${reason}`);
      });
    });

    res.socket.server.io = io;
  } else {
    console.log('Socket.IO ya está inicializado.');
  }

  res.end();
}
