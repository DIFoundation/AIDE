// src/components/chat/ChatWidget.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, X, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  type?: 'emergency' | 'shelter' | 'hospital' | 'general';
  requiresLocation?: boolean;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm AIDE, your AI Disaster Emergency Assistant. How can I help you today?",
      sender: 'bot',
      type: 'general'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Toggle chat window
  const toggleChat = () => setIsOpen(!isOpen);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Request user location
  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          // Resend the last user message with location
          const lastUserMessage = [...messages].reverse().find(m => m.sender === 'user');
          if (lastUserMessage) {
            handleSendMessage(lastUserMessage.text);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          addBotMessage("Couldn't access your location. Please enable location services and try again.", 'general');
        }
      );
    } else {
      addBotMessage("Geolocation is not supported by your browser", 'general');
    }
  };

  // Helper to add bot messages
  const addBotMessage = (text: string, type: 'emergency' | 'shelter' | 'hospital' | 'general' = 'general', requiresLocation = false) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text,
      sender: 'bot',
      type,
      requiresLocation
    }]);
  };

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          location: userLocation
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      // Add bot response to chat
      addBotMessage(
        data.response,
        data.queryType || 'general',
        data.requiresLocation
      );
    } catch (error) {
      console.error('Error sending message:', error);
      addBotMessage('Sorry, I encountered an error. Please try again later.', 'general');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleSendMessage(input);
    }
  };

  // Get message style based on type
  const getMessageStyle = (type?: string) => {
    switch (type) {
      case 'emergency':
        return 'bg-red-50 border-red-200';
      case 'shelter':
        return 'bg-blue-50 border-blue-200';
      case 'hospital':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-500 flex flex-col items-end space-y-2">
      {isOpen && (
        <div className="w-80 h-[500px] bg-white rounded-lg shadow-xl flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
            <h3 className="font-semibold">AIDE Assistant</h3>
            <button
              onClick={toggleChat}
              className="text-white hover:bg-white/20 p-1 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex',
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[80%] rounded-lg p-3',
                    message.sender === 'user'
                      ? 'bg-blue-100 text-gray-900'
                      : getMessageStyle(message.type)
                  )}
                >
                  <div className="whitespace-pre-wrap">{message.text}</div>
                  {message.requiresLocation && !userLocation && message.sender === 'bot' && (
                    <button
                      onClick={requestLocation}
                      className="mt-2 flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      <MapPin className="w-4 h-4 mr-1" />
                      Share Location
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg max-w-[80%]">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <form onSubmit={handleSubmit} className="border-t border-gray-200 p-3">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Chat toggle button */}
      <button
        onClick={toggleChat}
        className={cn(
          'h-14 w-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all',
          isOpen && 'hidden'
        )}
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
}