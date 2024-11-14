import React, { useState } from 'react';
import io, { Socket } from 'socket.io-client';

const socket: Socket = io();

const ChatInput = () => {
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit('chat message', input);
      setInput('');
    }
  };

  return (
    <div className="chat-input">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage}>Enviar</button>
    </div>
  );
};

export default ChatInput;
