import React, { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import ChatMessage from './ChatMessage';

const socket: Socket = io();

const ChatBox = () => {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    // Conectar el socket
    socket.on('chat message', (msg: string) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off('chat message');
    };
  }, []);

  return (
    <div>
      {messages.map((msg, index) => (
        <ChatMessage key={index} message={msg} />
      ))}
    </div>
  );
};

export default ChatBox;
