const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = new Server(httpServer);

  // Configuración de Socket.io
  io.on('connection', (socket) => {
    console.log('Usuario conectado');

    // Escuchar eventos del mensaje
    socket.on('chat message', (msg) => {
      io.emit('chat message', msg); // Enviar el mensaje a todos los clientes
    });

    // Desconectar
    socket.on('disconnect', () => {
      console.log('Usuario desconectado');
    });
  });

  // Configuración de Next.js
  server.all('*', (req, res) => handle(req, res));

  // Iniciar el servidor
  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
});
