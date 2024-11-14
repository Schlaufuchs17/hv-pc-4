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
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingMessageIndex, setEditingMessageIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>('');

  const socket = useRef<Socket | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null); 
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();

    if (typeof window !== 'undefined') {
      socket.current = io('http://localhost:3000', {
        transports: ['websocket'], 
        reconnectionAttempts: 5,  
        timeout: 10000,
      });

      socket.current.on('connect', () => {
        console.log('Conectado a Socket.IO con ID:', socket.current?.id);
      });

      socket.current.on('connect_error', (err) => {
        console.error('Error de conexión:', err.message);
      });

      socket.current.on('chat message', (msg: Message) => {
        console.log('Mensaje recibido en el cliente:', msg);
        setMessages((prevMessages) => [...prevMessages, msg]);
      });

      return () => {
        socket.current?.off('chat message');
        socket.current?.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]); 

  const sendMessage = () => {
    if (input.trim() && socket.current) {
      console.log('Enviando mensaje:', { text: input, user: 'User' });
      socket.current.emit('chat message', { text: input, user: 'User' });
      setInput('');
      inputRef.current?.focus();
    } else {
      console.error('No se pudo enviar el mensaje: entrada vacía o sin conexión.');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  const handleEditMessage = (index: number) => {
    setEditingMessageIndex(index);
    setEditingText(messages[index].text);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editingMessageIndex !== null) {
      const updatedMessages = [...messages];
      updatedMessages[editingMessageIndex] = { ...updatedMessages[editingMessageIndex], text: editingText };
      setMessages(updatedMessages);
      setIsEditing(false);
      setEditingMessageIndex(null);
      setEditingText('');
    }
  };

  const handleCloseModal = () => {
    setIsEditing(false);
    setEditingMessageIndex(null);
    setEditingText('');
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.chatContainer}>
        <div className={styles.messages}>
          {messages.map((msg, idx) => (
            <p
              key={idx}
              className={`${styles.messageItem} ${idx % 2 === 0 ? styles.alignLeft : styles.alignRight}`}
              onClick={() => handleEditMessage(idx)}
            >
              <strong>{msg.user}:</strong> {msg.text}
            </p>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className={styles.form}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)} 
            onKeyDown={handleKeyDown} 
            placeholder="Escribe un mensaje"
            className={styles.input}
          />
          <button onClick={sendMessage} className={styles.sendButton}>
            Enviar
          </button>
        </div>
      </div>

      {isEditing && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <input
              type="text"
              value={editingText}
              onChange={(e) => setEditingText(e.target.value)}
              className={styles.modalInput}
            />
            <button onClick={handleSaveEdit} className={styles.saveButton}>Guardar</button>
            <button onClick={handleCloseModal} className={styles.cancelButton}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
