import React, { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import styles from '../src/client/styles/style.module.css';

interface Message {
  text: string;
  user: string;
}

const HomePage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Configura el socket con opciones para forzar WebSocket
      socket.current = io('http://localhost:3000', {
        transports: ['websocket'],  // Forzar WebSocket para evitar problemas con polling
        reconnectionAttempts: 5,    // Reintentar conexión 5 veces
        timeout: 10000,             // Tiempo de espera para establecer la conexión
      });

      // Verifica la conexión
      socket.current.on('connect', () => {
        console.log('Conectado a Socket.IO con ID:', socket.current?.id);
      });

      // Si la conexión falla
      socket.current.on('connect_error', (err) => {
        console.error('Error de conexión:', err.message);
      });

      // Recibir mensajes desde el servidor
      socket.current.on('chat message', (msg: Message) => {
        console.log('Mensaje recibido en el cliente:', msg); // Para verificar el mensaje recibido
        setMessages((prevMessages) => [...prevMessages, msg]);
      });

      // Limpieza al desmontar el componente
      return () => {
        socket.current?.off('chat message');
        socket.current?.disconnect();
      };
    }
  }, []);

  const sendMessage = () => {
    if (input.trim() && socket.current) {
      console.log('Enviando mensaje:', { text: input, user: 'User' }); // Log del mensaje enviado
      socket.current.emit('chat message', { text: input, user: 'User' });
      setInput('');
    } else {
      console.error('No se pudo enviar el mensaje: entrada vacía o sin conexión.');
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messages}>
        {messages.map((msg, idx) => (
          <p key={idx} className={styles.messageItem}>
            <strong>{msg.user}:</strong> {msg.text}
          </p>
        ))}
      </div>
      <div className={styles.form}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un mensaje"
          className={styles.input}
        />
        <button onClick={sendMessage} className={styles.sendButton}>
          Enviar
        </button>
      </div>
    </div>
  );
};

export default HomePage;
