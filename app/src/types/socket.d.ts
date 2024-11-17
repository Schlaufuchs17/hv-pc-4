import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiResponse } from 'next';

export interface ExtendedServer extends HTTPServer {
  io?: SocketIOServer;
}

export interface ExtendedResponse extends NextApiResponse {
  socket: {
    server: ExtendedServer;
  };
}
