'use client';

import React, { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import styles from './styles/style.module.css';

interface Message {
  text: string;
  user: string;
}

const HomePage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const socket = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const socketInstance = io('/api/socket', {
      path: '/api/socket',
      transports: ['websocket'],
    });

    socketInstance.on('connect', () => {
      console.log('Conectado a Socket.IO con ID:', socketInstance.id);
    });

    socketInstance.on('connect_error', (err) => {
      console.error('Error de conexión:', err.message);
      alert('No se pudo conectar al servidor. Por favor, verifica tu conexión.');
    });

    socketInstance.on('chat message', (msg: Message) => {
      if (msg && msg.text && msg.user) {
        console.log('Mensaje recibido en el cliente:', msg);
        setMessages((prevMessages) => [...prevMessages, msg]);
      } else {
        console.error('Mensaje inválido recibido:', msg);
      }
    });

    socket.current = socketInstance;

    return () => {
      socketInstance.disconnect();
      console.log('Socket desconectado.');
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = () => {
    if (!socket.current) {
      console.error('Socket no inicializado. Verifica la conexión.');
      return;
    }

    if (!input.trim()) {
      console.error('El mensaje está vacío. Por favor, escribe algo antes de enviar.');
      return;
    }

    socket.current.emit('chat message', { text: input, user: 'User' });
    setInput('');
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.chatContainer}>
        <div className={styles.messages}>
          {messages.map((msg, idx) => (
            <p key={idx} className={styles.messageItem}>
              <strong>{msg.user}:</strong> {msg.text}
            </p>
          ))}
          <div ref={messagesEndRef} />
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
    </div>
  );
};

export default HomePage;
