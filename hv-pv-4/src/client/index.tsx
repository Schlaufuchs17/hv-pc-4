import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
/*Revisar la importacion desde _app.tsx  -->*/import styles from './style.module.css'; //Habia que convertirlo a modulo para que lo importara bien

// Interfaz de los mensajes de chat
interface Message {
  text: string;
  user: string;
}

// Define el tipo de socket usando ReturnType
type Socket = ReturnType<typeof io>;

const HomePage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const socket = useRef<Socket | null>(null);

  // Configurar el socket en el cliente dentro del useEffect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      socket.current = io('http://localhost:3000');

      // Escuchar mensajes entrantes del servidor
      socket.current.on('chat message', (msg: Message) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
      });

      // Limpiar el socket cuando se desmonte el componente
      return () => {
        socket.current?.off('chat message');
        socket.current?.disconnect();
      };
    }
  }, []);

  const sendMessage = () => {
    if (input.trim() && socket.current) {
      socket.current.emit('chat message', { text: input, user: 'User' });
      setInput('');  // Limpiar el campo de entrada después de enviar
    } else {
      console.error('No se pudo enviar el mensaje: entrada vacía o sin conexión.');
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messages}>
        {messages.map((msg, idx) => (
          <p key={idx}><strong>{msg.user}:</strong> {msg.text}</p>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Escribe un mensaje"
      />
      <button onClick={sendMessage}>Enviar</button>
    </div>
  );
};

export default HomePage;
