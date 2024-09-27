import React from 'react';
import { Button } from './ui/button';

interface ChatHistory {
  id: string;
  title: string;
}

interface ChatSidebarProps {
  chatHistory: ChatHistory[];
  onChatSelect: (id: string) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ chatHistory, onChatSelect }) => {
  return (
    <div className="w-64 h-full bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-4">Chat History</h2>
      {chatHistory.map((chat) => (
        <Button
          key={chat.id}
          className="w-full text-left mb-2 overflow-hidden overflow-ellipsis whitespace-nowrap"
          variant="ghost"
          onClick={() => onChatSelect(chat.id)}
        >
          {chat.title}
        </Button>
      ))}
    </div>
  );
};