import React from 'react';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUser, timestamp }) => {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[70%] rounded-lg p-3 ${
        isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
      }`}>
        {!isUser && <p className="text-sm mb-1">Game Master</p>}
        <p className="text-base break-words">{message}</p>
        <p className={`text-xs mt-2 ${isUser ? 'text-blue-200' : 'text-gray-500'}`}>
          {timestamp}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;