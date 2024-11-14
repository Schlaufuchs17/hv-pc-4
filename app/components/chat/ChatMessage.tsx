import React from 'react';

interface ChatMessageProps {
  message: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => (
  <div className="chat-message">
    {message}
  </div>
);

export default ChatMessage;
