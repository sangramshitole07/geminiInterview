'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Bot, User, Sparkles, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useInterviewState } from '@/hooks/use-interview-state';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  score?: number;
  feedback?: string;
}

interface InterviewChatProps {
  isPopupOpen: boolean;
  onTogglePopup: (open: boolean) => void;
}

export function InterviewChat({ isPopupOpen, onTogglePopup }: InterviewChatProps) {
  const { selectedLanguage, responses, getAverageScore } = useInterviewState();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isPopupOpen && messages.length === 0) {
      // Add welcome message when chat opens
      setMessages([
        {
          id: 'welcome',
          type: 'assistant',
          content: `Welcome to your ${selectedLanguage} technical interview! I'm your senior technical recruiter and I'll be conducting this comprehensive interview session.

I'll start with some foundational questions and gradually increase the complexity based on your performance. I'm looking for both technical knowledge and problem-solving approach.

Let's begin with your first question!`,
          timestamp: new Date(),
        }
      ]);
    }
  }, [isPopupOpen, selectedLanguage]);

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI response (in real app, this would come from CopilotKit)
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `Thank you for your answer! I can see you have a good understanding of the concept. Let me provide some feedback and ask the next question.

**Score: 8/10**

**Feedback:**
- Good understanding of the core concept
- Could improve on edge cases
- Consider performance implications

**Next Question:**
Can you explain how you would handle error cases in this scenario?`,
        timestamp: new Date(),
        score: 8,
        feedback: 'Good understanding of the core concept. Could improve on edge cases and performance implications.'
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="h-[600px] shadow-lg flex flex-col">
      <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <span>Interview Chat</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{responses.length} questions completed</span>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0 flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  
                  <div className={`rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                    
                    {message.score && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <div className="flex items-center space-x-2 text-xs">
                          <Sparkles className="w-3 h-3" />
                          <span className="font-medium">Score: {message.score}/10</span>
                        </div>
                        {message.feedback && (
                          <p className="text-xs mt-1 opacity-80">{message.feedback}</p>
                        )}
                      </div>
                    )}
                    
                    <div className={`text-xs mt-1 ${
                      message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex items-start space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Type your answer here..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
            <Button
              onClick={() => {
                const input = document.querySelector('input') as HTMLInputElement;
                if (input?.value) {
                  handleSendMessage(input.value);
                  input.value = '';
                }
              }}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="mt-2 text-xs text-gray-500 text-center">
            💡 Tip: Be detailed in your answers and explain your reasoning
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 