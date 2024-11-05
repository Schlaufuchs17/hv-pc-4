//Reemplaza a app.tsx y actua de pagina de inicio
import React, { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import styles from '..src/client/style.css';

//Interfaz de los mensajes de chat
interface Message {
  text: string;
  user: string;
}

// Configurar el socket en el cliente
const socket: Socket = io('http://localhost:3000');

const HomePage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');

  useEffect(() => {
    // Escuchar mensajes entrantes del servidor
    socket.on('chat message', (msg: Message) => {
      setMessages(prevMessages => [...prevMessages, msg]);
    });

    // Limpiar el socket cuando se desmonte el componente
    return () => {
      socket.off('chat message');
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit('chat message', { text: input, user: 'User' });
      setInput('');
    }
  };

  return (
    <div className={styles.container}>
      <h1>Chat App</h1>
      <div className={styles.chatWindow}>
        {messages.map((msg, index) => (
          <div key={index} className={styles.message}>
            <strong>{msg.user}</strong>: {msg.text}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default HomePage;
