
'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CopilotPopup, CopilotChat } from '@copilotkit/react-ui';
import { CopilotKit } from '@copilotkit/react-core';
import { useCopilotAction, useCopilotReadable } from '@copilotkit/react-core';
import '@copilotkit/react-ui/styles.css';
import { CopilotKitCSSProperties } from "@copilotkit/react-ui";
 
import { useInterviewState } from '@/hooks/use-interview-state';
import { LanguageSelector } from '@/components/LanguageSelector';
import { InterviewStats } from '@/components/InterviewStats';
import { CopilotSuggestions } from '@/components/CopilotSuggestions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Code, MessageSquare, RefreshCw, Sparkles, Trophy, Target, Clock, BookOpen } from 'lucide-react';

// AI Interviewer Prompt (for main CopilotChat)
const INTERVIEWER_PROMPT = `You are an AI Interviewer. Your role is to conduct a professional technical interview.

---
**Core Instructions & Persona:**
- **Initial State**: You are waiting for the user to select a programming language. Your first response MUST be to ask the user which language they want to be interviewed in. DO NOT ask any other questions before this.
- **Interviewer Role**: Once the user selects a language, you will act as a professional interviewer for that specific language.
- **Pacing**: Ask one question at a time. Never ask multiple questions in a single response. Wait for the user's answer before proceeding.
- **Evaluation**: After each answer, provide constructive feedback and a score out of 10. The score should reflect correctness, clarity, and overall problem-solving approach.
- **Difficulty**: Questions should start at an "easy" level and gradually increase in difficulty based on the user's performance.

---
**Question Formats (MANDATORY TEMPLATES):**
You MUST use these exact formats for your questions. The formatting is crucial for the application's UI.

1.  **MCQ Format (for multiple-choice questions):**
    🚀 **[LANGUAGE] Interview Question #[NUMBER]**

    [Clear question text]

    \`\`\`[language-lowercase]
    [Optional code snippet]
    \`\`\`

    **Choose the best answer:**
    🅰️ A) [Option A text]
    🅱️ B) [Option B text]
    🅲️ C) [Option C text]
    🅳️ D) [Option D text]

    💡 *Hint: [Brief helpful hint]*

2.  **Code Snippet Analysis Format:**
    📝 **Code Analysis Challenge**

    \`\`\`[language-lowercase]
    [Complete, runnable code snippet with a potential bug or subtle behavior]
    \`\`\`

    **Question:** [A specific question about the code, e.g., "What is the output?", "Find the bug.", "Explain the performance."]

3.  **Code Completion Format:**
    🔧 **Complete the Code**

    \`\`\`[language-lowercase]
    [Partial code with a clear TODO comment or blank space]
    // TODO: Implement the solution here
    \`\`\`

    **Requirements:** [Clear, concise requirements for the user to complete the code.]

4.  **DSA Challenge Format:**
    🧠 **Algorithm Challenge**

    **Problem:** [Clear problem statement for a data structures and algorithms challenge.]
    **Input:** [Input format and constraints.]
    **Output:** [Expected output format.]
    **Example:** [At least one clear example with input and expected output.]

---
**Context Awareness:**
You have access to real-time interview context including:
- Current interview state and progress
- Selected programming language and its characteristics
- Recent performance and response history
- Session configuration and settings
- User interaction patterns and preferences

Use this context to:
- Adapt question difficulty based on performance
- Provide personalized feedback
- Reference previous responses when relevant
- Adjust your approach based on user behavior patterns
- Track progress and maintain session continuity

---


---
**Available Actions:**
You have access to the following actions that you can call during the interview:

1. **scoreAnswer**: Use this to score the user's answer and provide feedback
   - Parameters: score (1-10), feedback, strengths, improvements
   - Use when: User provides an answer to a question

2. **askNextQuestion**: Use this to ask the next interview question
   - Parameters: questionType, difficulty, language
   - Use when: After scoring an answer to proceed to the next question

3. **provideHint**: Use this to give helpful hints without giving away answers
   - Parameters: hint, category
   - Use when: User is struggling or asks for help

4. **trackProgress**: Use this to track interview progress
   - Parameters: questionsAnswered, averageScore, timeSpent
   - Use when: You want to update progress metrics

---
**Your First Response:**
"Hello! I'm your AI Interviewer. To get started, please select a programming language you'd like to be interviewed in. You can choose from Java, Python, JavaScript, or C++."`;

export default function InterviewApp() {

  
  const { 
    isInterviewActive, 
    selectedLanguage, 
    startInterview, 
    resetInterview,
    responses,
    getAverageScore,
    _hasHydrated,
    setHasHydrated
  } = useInterviewState();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isInterviewerChatOpen, setIsInterviewerChatOpen] = useState(false);

  // Custom actions for the AI Interviewer
  useCopilotAction({
    name: "scoreAnswer",
    description: "Score the user's answer and provide feedback. Use this when the user provides an answer to an interview question.",
    parameters: [
      {
        name: "score",
        type: "number",
        description: "Score out of 10 (1-10)",
      },
      {
        name: "feedback",
        type: "string",
        description: "Constructive feedback on the answer",
      },
      {
        name: "strengths",
        type: "string",
        description: "What the user did well",
      },
      {
        name: "improvements",
        type: "string",
        description: "Areas for improvement",
      }
    ],
    handler: async ({ score, feedback, strengths, improvements }) => {
      // In a real app, this would update the interview state
      console.log(`Scored answer: ${score}/10`);
      console.log(`Feedback: ${feedback}`);
      console.log(`Strengths: ${strengths}`);
      console.log(`Improvements: ${improvements}`);
      
      return {
        success: true,
        message: `Answer scored: ${score}/10. ${feedback}`
      };
    },
    render: ({ result }) => (
      <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
        <Trophy className="w-4 h-4 text-green-600" />
        <span className="text-sm font-medium">{result.message}</span>
      </div>
    ),
  });

  useCopilotAction({
    name: "askNextQuestion",
    description: "Ask the next interview question. Use this after scoring an answer to proceed to the next question.",
    parameters: [
      {
        name: "questionType",
        type: "string",
        description: "Type of question (MCQ, Code Analysis, Code Completion, DSA Challenge)",
      },
      {
        name: "difficulty",
        type: "string",
        description: "Difficulty level (Easy, Medium, Hard)",
      },
      {
        name: "language",
        type: "string",
        description: "Programming language for the question",
      }
    ],
    handler: async ({ questionType, difficulty, language }) => {
      console.log(`Asking ${difficulty} ${questionType} question for ${language}`);
      
      return {
        success: true,
        message: `Preparing ${difficulty} ${questionType} question for ${language}`
      };
    },
    render: ({ result }) => (
      <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
        <Target className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-medium">{result.message}</span>
      </div>
    ),
  });

  useCopilotAction({
    name: "provideHint",
    description: "Provide a helpful hint to the user without giving away the complete answer.",
    parameters: [
      {
        name: "hint",
        type: "string",
        description: "The hint to provide to the user",
      },
      {
        name: "category",
        type: "string",
        description: "Category of hint (concept, approach, syntax, etc.)",
      }
    ],
    handler: async ({ hint, category }) => {
      console.log(`Providing ${category} hint: ${hint}`);
      
      return {
        success: true,
        message: `Hint provided: ${hint}`
      };
    },
    render: ({ result }) => (
      <div className="flex items-center space-x-2 p-2 bg-yellow-50 rounded-lg">
        <Sparkles className="w-4 h-4 text-yellow-600" />
        <span className="text-sm font-medium">{result.message}</span>
      </div>
    ),
  });

  useCopilotAction({
    name: "trackProgress",
    description: "Track the user's interview progress and performance metrics.",
    parameters: [
      {
        name: "questionsAnswered",
        type: "number",
        description: "Number of questions answered so far",
      },
      {
        name: "averageScore",
        type: "number",
        description: "Current average score",
      },
      {
        name: "timeSpent",
        type: "string",
        description: "Time spent in the interview",
      }
    ],
    handler: async ({ questionsAnswered, averageScore, timeSpent }) => {
      console.log(`Progress: ${questionsAnswered} questions, ${averageScore} avg score, ${timeSpent}`);
      
      return {
        success: true,
        message: `Progress tracked: ${questionsAnswered} questions completed`
      };
    },
    render: ({ result }) => (
      <div className="flex items-center space-x-2 p-2 bg-purple-50 rounded-lg">
        <Clock className="w-4 h-4 text-purple-600" />
        <span className="text-sm font-medium">{result.message}</span>
      </div>
    ),
  });

  // Custom actions for the AI Assistant
  useCopilotAction({
    name: "explainConcept",
    description: "Explain a programming concept in simple terms with examples.",
    parameters: [
      {
        name: "concept",
        type: "string",
        description: "The programming concept to explain",
      },
      {
        name: "language",
        type: "string",
        description: "Programming language context",
      },
      {
        name: "level",
        type: "string",
        description: "Explanation level (beginner, intermediate, advanced)",
      }
    ],
    handler: async ({ concept, language, level }) => {
      console.log(`Explaining ${concept} for ${language} at ${level} level`);
      
      return {
        success: true,
        message: `Explained ${concept} for ${language} (${level} level)`
      };
    },
    render: ({ result }) => (
      <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
        <BookOpen className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-medium">{result.message}</span>
      </div>
    ),
  });

  useCopilotAction({
    name: "showCodeExample",
    description: "Show a code example to illustrate a concept.",
    parameters: [
      {
        name: "example",
        type: "string",
        description: "The code example to show",
      },
      {
        name: "language",
        type: "string",
        description: "Programming language of the example",
      },
      {
        name: "description",
        type: "string",
        description: "Brief description of what the example demonstrates",
      }
    ],
    handler: async ({ example, language, description }) => {
      console.log(`Showing ${language} example: ${description}`);
      
      return {
        success: true,
        message: `Showed ${language} example: ${description}`
      };
    },
    render: ({ result }) => (
      <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
        <Code className="w-4 h-4 text-green-600" />
        <span className="text-sm font-medium">{result.message}</span>
      </div>
    ),
    });

  // Provide context to the AI Interviewer
  const interviewContextId = useCopilotReadable({
    description: "Current interview state and progress",
    value: {
      isInterviewActive,
      selectedLanguage,
      questionsAnswered: responses.length,
      averageScore: getAverageScore(),
      currentSession: {
        startTime: isInterviewActive ? new Date().toISOString() : null,
        duration: isInterviewActive ? "Active session" : "No active session"
      }
    }
  });

  // Provide language-specific context
  useCopilotReadable({
    description: "Selected programming language and its characteristics",
    value: {
      language: selectedLanguage,
      languageFeatures: selectedLanguage === 'JavaScript' ? {
        focusAreas: ['ES6+ features', 'Async programming', 'DOM manipulation', 'Closures', 'Prototypal inheritance'],
        difficulty: 'Medium to Advanced',
        commonTopics: ['Promises', 'async/await', 'Arrow functions', 'Destructuring', 'Modules']
      } : selectedLanguage === 'Python' ? {
        focusAreas: ['Pythonic code', 'List comprehensions', 'Decorators', 'Exception handling', 'Memory management'],
        difficulty: 'Easy to Advanced',
        commonTopics: ['List comprehensions', 'Generators', 'Context managers', 'EAFP principle', 'Popular libraries']
      } : selectedLanguage === 'Java' ? {
        focusAreas: ['OOP principles', 'Collections framework', 'Exception handling', 'Memory management', 'Concurrency'],
        difficulty: 'Medium to Advanced',
        commonTopics: ['ArrayList', 'HashMap', 'Generics', 'Checked exceptions', 'Threading']
      } : selectedLanguage === 'C++' ? {
        focusAreas: ['Memory management', 'STL containers', 'Templates', 'Exception handling', 'Performance optimization'],
        difficulty: 'Advanced',
        commonTopics: ['Pointers', 'Smart pointers', 'RAII', 'Move semantics', 'STL algorithms']
      } : {
        focusAreas: ['Core concepts', 'Best practices', 'Performance considerations'],
        difficulty: 'Varies',
        commonTopics: ['Fundamentals', 'Advanced concepts', 'Best practices']
      }
    },
    parentId: interviewContextId
  });

  // Provide recent performance context
  useCopilotReadable({
    description: "Recent interview performance and responses",
    value: {
      recentResponses: responses.slice(-3).map((response, index) => ({
        questionNumber: responses.length - 2 + index,
        score: response.score,
        timestamp: new Date().toISOString(),
        performance: response.score >= 8 ? 'Excellent' : response.score >= 6 ? 'Good' : 'Needs Improvement'
      })),
      performanceTrend: responses.length > 0 ? {
        lastThreeScores: responses.slice(-3).map(r => r.score),
        averageLastThree: responses.slice(-3).reduce((sum, r) => sum + r.score, 0) / Math.min(3, responses.length),
        improvement: responses.length >= 2 ? responses[responses.length - 1].score > responses[responses.length - 2].score : null
      } : null
    },
    parentId: interviewContextId
  });

  // Provide interview session context
  useCopilotReadable({
    description: "Interview session configuration and settings",
    value: {
      sessionSettings: {
        maxQuestions: 10,
        adaptiveDifficulty: true,
        scoringEnabled: true,
        feedbackEnabled: true,
        hintSystem: true
      },
      currentQuestion: responses.length + 1,
      sessionProgress: {
        percentage: Math.min((responses.length / 10) * 100, 100),
        stage: responses.length < 3 ? 'Warm-up' : responses.length < 7 ? 'Core' : 'Advanced'
      }
    },
    parentId: interviewContextId
  });

  // Provide user interaction context
  useCopilotReadable({
    description: "User interaction patterns and preferences",
    value: {
      userBehavior: {
        averageResponseTime: "2-3 minutes",
        detailLevel: responses.length > 0 ? 
          responses.filter(r => r.score >= 8).length > responses.length / 2 ? 'High' : 'Medium' : 'Unknown',
        helpRequests: 0, // This could be tracked separately
        preferredQuestionTypes: responses.length > 0 ? {
          totalQuestions: responses.length,
          averageScore: getAverageScore(),
          scoreDistribution: {
            excellent: responses.filter(r => r.score >= 8).length,
            good: responses.filter(r => r.score >= 6 && r.score < 8).length,
            needsImprovement: responses.filter(r => r.score < 6).length
          }
        } : null
      }
    },
    parentId: interviewContextId
  });

  // Provide context to the AI Assistant
  const assistantContextId = useCopilotReadable({
    description: "Current interview context for the assistant",
    value: {
      currentLanguage: selectedLanguage,
      interviewProgress: {
        questionsAnswered: responses.length,
        averageScore: getAverageScore(),
        isActive: isInterviewActive
      },
      recentPerformance: responses.length > 0 ? {
        lastScore: responses[responses.length - 1].score,
        trend: responses.length >= 2 ? 
          responses[responses.length - 1].score > responses[responses.length - 2].score ? 'Improving' : 'Declining' : 'Stable'
      } : null
    }
  });

  // Provide language-specific help context for assistant
  useCopilotReadable({
    description: "Language-specific help areas and common challenges",
    value: {
      language: selectedLanguage,
      commonChallenges: selectedLanguage === 'JavaScript' ? [
        'Understanding closures and scope',
        'Async programming with Promises',
        'ES6+ features and modern syntax',
        'Prototypal inheritance vs classical',
        'Event handling and DOM manipulation'
      ] : selectedLanguage === 'Python' ? [
        'Pythonic code', 'List comprehensions', 'Decorators', 'Exception handling', 'Memory management'
      ] : selectedLanguage === 'Java' ? [
        'OOP principles', 'Collections framework', 'Exception handling', 'Memory management', 'Concurrency'
      ] : selectedLanguage === 'C++' ? [
        'Memory management', 'STL containers', 'Templates', 'Exception handling', 'Performance optimization'
      ] : [
        'Core concepts', 'Best practices', 'Performance considerations', 'Common pitfalls'
      ],
      helpfulResources: selectedLanguage === 'JavaScript' ? [
        'MDN Web Docs', 'JavaScript.info', 'ES6+ features guide', 'Async/await patterns'
      ] : selectedLanguage === 'Python' ? [
        'Python official docs', 'Real Python tutorials', 'Python decorators guide', 'Context managers tutorial'
      ] : selectedLanguage === 'Java' ? [
        'Oracle Java docs', 'Java collections tutorial', 'Concurrency in practice', 'Effective Java book'
      ] : selectedLanguage === 'C++' ? [
        'C++ reference', 'STL documentation', 'Modern C++ features', 'RAII and smart pointers'
      ] : [
        'Language official docs', 'Best practices guides', 'Performance tutorials'
      ]
    },
    parentId: assistantContextId
  });
   
  const handleLanguageSelection = useCallback((language: string) => {
    startInterview(language);
    setIsInterviewerChatOpen(true);
  }, [startInterview]);

  const handleResetInterview = useCallback(() => {
    resetInterview();
    setIsPopupOpen(false);
    setIsInterviewerChatOpen(false);
  }, [resetInterview]);

  useEffect(() => {
    setHasHydrated(true);
  }, [setHasHydrated]);
  
  if (!_hasHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading InterviewXP...</p>
        </div>
      </div>
    );
  }

  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                InterviewXP
              </h1>
            </div>
            
            {isInterviewActive && (
              <Button
                onClick={handleResetInterview}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 hover:bg-red-50 hover:border-red-200 hover:text-red-700"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset Interview</span>
              </Button>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            {!isInterviewActive ? (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto"
              >
                {/* Hero Section */}
                <div className="text-center mb-12">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="mb-6"
                  >
                    <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-4 py-2 mb-4">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">AI-Powered Interview Practice</span>
                    </div>
                    
                    <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
                      Master Your
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {' '}Technical Interview
                      </span>
                    </h2>
                    
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                      Practice with our AI interviewer, get real-time feedback, and build confidence 
                      for your next technical interview. Choose your language and start improving today.
                    </p>
                  </motion.div>

                  {/* Language Selection */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <LanguageSelector onSelect={handleLanguageSelection} />
                  </motion.div>
                </div>

                {/* Features */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="grid md:grid-cols-3 gap-6 mb-12"
                >
                  {[
                    {
                      icon: <Brain className="w-8 h-8" />,
                      title: 'AI-Powered Questions',
                      description: 'Dynamic questions that adapt to your skill level and provide personalized challenges.',
                      color: 'from-blue-500 to-cyan-500'
                    },
                    {
                      icon: <Code className="w-8 h-8" />,
                      title: 'Multiple Formats',
                      description: 'Practice MCQs, code analysis, algorithm challenges, and system design problems.',
                      color: 'from-purple-500 to-pink-500'
                    },
                    {
                      icon: <MessageSquare className="w-8 h-8" />,
                      title: 'Real-time Feedback',
                      description: 'Get instant scoring and detailed explanations to improve your performance.',
                      color: 'from-green-500 to-teal-500'
                    }
                  ].map((feature, index) => (
                    <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <CardHeader className="text-center">
                        <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-4`}>
                          {feature.icon}
                        </div>
                        <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 text-center">{feature.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="interview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="max-w-6xl mx-auto"
              >
                {/* Interview Header */}
                <div className="mb-8">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center space-x-4 mb-4"
                  >
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                      <Code className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {selectedLanguage} Technical Interview
                      </h2>
                      <p className="text-gray-600">
                        Interactive session with AI interviewer • Real-time feedback
                      </p>
                    </div>
                  </motion.div>
                  
                  <InterviewStats />
                </div>

                {/* Interview Content */}
                <CopilotSuggestions isVisible={isInterviewActive} />
                
                {/* Performance Summary Card - Moved above the chat */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-6"
                >
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        <span>Performance Summary</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {getAverageScore().toFixed(1)}/10
                          </div>
                          <div className="text-sm text-blue-700">Average Score</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">
                            {responses.length}
                          </div>
                          <div className="text-sm text-purple-700">Questions Completed</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {Math.min(responses.length * 10, 100)}%
                          </div>
                          <div className="text-sm text-green-700">Progress</div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="text-sm text-gray-600 mb-2">Overall Progress</div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(responses.length * 10, 100)}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Interview Chat Section - Improved Gemini-like UI */}
                <div className="space-y-4">
                  {/* Assistant Help Button */}
                  <div className="flex justify-end space-x-2">
                    <Button
                      onClick={() => setIsInterviewerChatOpen(true)}
                      variant="outline"
                      className="bg-gradient-to-r from-purple-500 to-blue-600 text-white hover:from-purple-600 hover:to-blue-700 border-0"
                    >
                      <Brain className="w-4 h-4 mr-2" />
                      Start Interview
                    </Button>
                    <Button
                      onClick={() => setIsPopupOpen(true)}
                      variant="outline"
                      className="bg-gradient-to-r from-green-500 to-teal-600 text-white hover:from-green-600 hover:to-teal-700 border-0"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Get Help
                    </Button>
                  </div>
                  
                  {/* CopilotChat with Gemini-like styling */}
                  <AnimatePresence>
                    {isInterviewerChatOpen && (
                     <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -20 }}
                     transition={{ duration: 0.5 }}
                     className="w-full"
                   >
                     <Card className="shadow-xl border-0 overflow-hidden bg-white flex flex-col h-[70vh]">
                       <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
                         <div className="flex items-center space-x-3">
                           <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                             <Brain className="w-4 h-4 text-white" />
                           </div>
                           <div>
                             <h3 className="font-semibold text-gray-900">🤖 {selectedLanguage} Interviewer</h3>
                             <p className="text-sm text-gray-600">AI-powered technical interview session</p>
                           </div>
                         </div>
                       </div>
                       <div className="flex-1 overflow-auto">
                         <CopilotChat
                           instructions={INTERVIEWER_PROMPT}
                           labels={{
                             title: `🤖 ${selectedLanguage} Interviewer`,
                             initial: `Welcome to your ${selectedLanguage} interview. Let's begin when you are ready.`,
                             placeholder: 'Your answer...',
                           }}
                           className="h-full"
                         />
                       </div>
                     </Card>
                   </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Recent Performance Section - Moved to bottom */}
                {responses.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-6"
                  >
                    <Card className="shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center space-x-2">
                          <Clock className="w-5 h-5 text-blue-500" />
                          <span>Recent Performance</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {responses.slice(-3).map((response, index) => (
                            <div key={index} className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                              <span className="text-sm font-medium text-gray-700">
                                Question {responses.length - 2 + index}
                              </span>
                              <div className="flex items-center space-x-3">
                                <div className={`w-3 h-3 rounded-full ${
                                  response.score >= 8 ? 'bg-green-500' : 
                                  response.score >= 6 ? 'bg-yellow-500' : 'bg-red-500'
                                }`} />
                                <span className="font-semibold text-lg">{response.score}/10</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>



        {/* AI Assistant Popup (CopilotPopup) */}
        {isInterviewActive && (
          <div
            style={
              {
                "--copilot-kit-primary-color": "#374151", // ChatGPT green
                "--copilot-kit-secondary-color": "#374151", // ChatGPT dark background
                "--copilot-kit-accent-color": "#19c37d", // ChatGPT accent green
                "--copilot-kit-background-color": "#f7f7f8", // ChatGPT light background
                "--copilot-kit-text-color": "#202123", // ChatGPT text color
                "--copilot-kit-border-color": "#475569", // ChatGPT border color
                "--copilot-kit-shadow": "0 4px 32px 0 rgba(32,33,35,0.08)",
                "--copilot-kit-border-radius": "20px",
                "--copilot-kit-font-family": "'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
                "--copilot-kit-popup-width": "480px", // Or adjust as needed
"--copilot-kit-popup-height": "600px", // Or adjust as needed
"--copilot-kit-popup-max-width": "95vw", // Responsive max width
"--copilot-kit-popup-max-height": "90vh", // Responsive max height
              } as CopilotKitCSSProperties
            }
          >
            <CopilotKit runtimeUrl="/api/copilotkit">
              <CopilotPopup 
                labels={{
                  title: `🤖 ${selectedLanguage} Interview Assistant`,
                  initial: `Hi! I'm your ${selectedLanguage} interview assistant. I'm here to help you with hints, suggestions, and guidance during your technical interview.

**How I can help:**
- Provide hints when you're stuck
- Explain concepts in simple terms
- Give code examples
- Break down complex problems
- Suggest approaches and strategies

Just ask me for help with any question you're working on!`,
                  placeholder: 'Ask for hints, explanations, or help...',
                }}
                defaultOpen={isPopupOpen}
              />
            </CopilotKit>
          </div>
        )}
      </div>
    </CopilotKit>
  );
}
