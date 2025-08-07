'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Bot, User, Sparkles, Clock, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useInterviewState } from '@/hooks/use-interview-state';

interface InterviewMessage {
  id: string;
  type: 'interviewer' | 'user';
  content: string;
  timestamp: Date;
  score?: number;
  feedback?: string;
  questionType?: string;
}

interface InterviewerProps {
  selectedLanguage: string;
  onAnswerSubmit: (answer: string) => void;
}

export function Interviewer({ selectedLanguage, onAnswerSubmit }: InterviewerProps) {
  const { responses, getAverageScore } = useInterviewState();
  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [showSubmitButton, setShowSubmitButton] = useState(false);

  // Sample interview questions for different languages
  const getInterviewQuestions = () => {
    const questions = {
      JavaScript: [
        {
          question: "Explain the difference between `let`, `const`, and `var` in JavaScript. When would you use each?",
          type: "Fundamentals",
          difficulty: "Easy"
        },
        {
          question: "What are closures in JavaScript? Can you provide an example?",
          type: "Advanced Concepts",
          difficulty: "Medium"
        },
        {
          question: "Explain how Promises work and how they differ from callbacks.",
          type: "Asynchronous Programming",
          difficulty: "Medium"
        }
      ],
      Python: [
        {
          question: "What is the difference between a list and a tuple in Python? When would you use each?",
          type: "Data Structures",
          difficulty: "Easy"
        },
        {
          question: "Explain list comprehensions and provide an example.",
          type: "Pythonic Code",
          difficulty: "Medium"
        },
        {
          question: "What are decorators in Python? How do they work?",
          type: "Advanced Concepts",
          difficulty: "Hard"
        }
      ],
      Java: [
        {
          question: "Explain the difference between `==` and `.equals()` in Java.",
          type: "Fundamentals",
          difficulty: "Easy"
        },
        {
          question: "What is the difference between `String`, `StringBuilder`, and `StringBuffer`?",
          type: "Performance",
          difficulty: "Medium"
        },
        {
          question: "Explain the concept of generics in Java with examples.",
          type: "Advanced Concepts",
          difficulty: "Hard"
        }
      ],
      'C++': [
        {
          question: "What is the difference between pointers and references in C++?",
          type: "Memory Management",
          difficulty: "Medium"
        },
        {
          question: "Explain the concept of RAII in C++.",
          type: "Resource Management",
          difficulty: "Medium"
        },
        {
          question: "What are smart pointers? Explain `unique_ptr`, `shared_ptr`, and `weak_ptr`.",
          type: "Modern C++",
          difficulty: "Hard"
        }
      ],
      TypeScript: [
        {
          question: "What are the benefits of using TypeScript over JavaScript?",
          type: "Fundamentals",
          difficulty: "Easy"
        },
        {
          question: "Explain the difference between `interface` and `type` in TypeScript.",
          type: "Type System",
          difficulty: "Medium"
        },
        {
          question: "What are generics in TypeScript? Provide an example.",
          type: "Advanced Types",
          difficulty: "Hard"
        }
      ],
      Go: [
        {
          question: "What are goroutines and how do they differ from threads?",
          type: "Concurrency",
          difficulty: "Medium"
        },
        {
          question: "Explain the concept of channels in Go.",
          type: "Concurrency",
          difficulty: "Medium"
        },
        {
          question: "What is the difference between slices and arrays in Go?",
          type: "Data Structures",
          difficulty: "Easy"
        }
      ],
      Rust: [
        {
          question: "Explain the concept of ownership in Rust.",
          type: "Memory Safety",
          difficulty: "Medium"
        },
        {
          question: "What are lifetimes in Rust and why are they important?",
          type: "Memory Safety",
          difficulty: "Hard"
        },
        {
          question: "Explain the difference between `String` and `&str` in Rust.",
          type: "Fundamentals",
          difficulty: "Medium"
        }
      ],
      SQL: [
        {
          question: "Explain the difference between INNER JOIN and LEFT JOIN.",
          type: "Joins",
          difficulty: "Easy"
        },
        {
          question: "What are indexes and when should you use them?",
          type: "Performance",
          difficulty: "Medium"
        },
        {
          question: "Explain ACID properties in database transactions.",
          type: "Transactions",
          difficulty: "Medium"
        }
      ]
    };
    
    return questions[selectedLanguage as keyof typeof questions] || questions.JavaScript;
  };

  useEffect(() => {
    if (messages.length === 0) {
      startInterview();
    }
  }, []);

  const startInterview = () => {
    const questions = getInterviewQuestions();
    const firstQuestion = questions[0];
    
    const welcomeMessage: InterviewMessage = {
      id: 'welcome',
      type: 'interviewer',
      content: `Welcome to your ${selectedLanguage} technical interview! I'm your interviewer and I'll be asking you questions to assess your knowledge and problem-solving skills.

Let's start with our first question:

**Question:** ${firstQuestion.question}

**Type:** ${firstQuestion.type}
**Difficulty:** ${firstQuestion.difficulty}

Please provide a detailed answer explaining your understanding and approach.`,
      timestamp: new Date(),
      questionType: firstQuestion.type
    };

    setMessages([welcomeMessage]);
    setCurrentQuestion(firstQuestion.question);
    setShowSubmitButton(true);
  };

  const handleSubmitAnswer = () => {
    if (!userAnswer.trim()) return;

    const userMessage: InterviewMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: userAnswer,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    setShowSubmitButton(false);

    // Simulate interviewer response and scoring
    setTimeout(() => {
      const score = Math.floor(Math.random() * 4) + 7; // Score between 7-10 for demo
      const feedback = getFeedback(score);
      
      const interviewerMessage: InterviewMessage = {
        id: (Date.now() + 1).toString(),
        type: 'interviewer',
        content: `Thank you for your answer!

**Score: ${score}/10**

**Feedback:**
${feedback}

**Next Question:**
${getNextQuestion()}`,
        timestamp: new Date(),
        score,
        feedback
      };

      setMessages(prev => [...prev, interviewerMessage]);
      setIsTyping(false);
      setUserAnswer('');
      setShowSubmitButton(true);
      
      // Call the callback to update the main state
      onAnswerSubmit(userAnswer);
    }, 2000);
  };

  const getFeedback = (score: number): string => {
    if (score >= 9) {
      return "Excellent understanding! You demonstrated deep knowledge and clear communication.";
    } else if (score >= 7) {
      return "Good answer! You showed solid understanding with room for improvement in some areas.";
    } else if (score >= 5) {
      return "Fair response. Consider reviewing the fundamentals and providing more detailed explanations.";
    } else {
      return "Basic understanding shown. I recommend studying this topic more thoroughly.";
    }
  };

  const getNextQuestion = (): string => {
    const questions = getInterviewQuestions();
    const currentIndex = Math.min(responses.length + 1, questions.length - 1);
    const nextQuestion = questions[currentIndex];
    
    if (nextQuestion) {
      setCurrentQuestion(nextQuestion.question);
      return `${nextQuestion.question}\n\n**Type:** ${nextQuestion.type}\n**Difficulty:** ${nextQuestion.difficulty}`;
    } else {
      return "That concludes our interview! Thank you for your time.";
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="h-[600px] shadow-lg flex flex-col">
      <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-blue-50">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <span>Interview Session</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Question {Math.min(responses.length + 1, 3)}/3</span>
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
                      : 'bg-purple-500 text-white'
                  }`}>
                    {message.type === 'user' ? <User className="w-4 h-4" /> : <Brain className="w-4 h-4" />}
                  </div>
                  
                  <div className={`rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-purple-100 text-gray-800'
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
                <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center">
                  <Brain className="w-4 h-4" />
                </div>
                <div className="bg-purple-100 rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
        
        <div className="border-t p-4">
          <div className="space-y-3">
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={3}
            />
            
            {showSubmitButton && (
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  💡 Tip: Be detailed and explain your reasoning
                </div>
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={!userAnswer.trim()}
                  className="bg-purple-500 hover:bg-purple-600 disabled:opacity-50"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Answer
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 