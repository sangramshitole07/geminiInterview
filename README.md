# InterviewXP - AI-Powered Technical Interview Practice

A comprehensive technical interview practice application powered by AI, featuring two distinct AI agents for optimal user experience.

## 🎯 Features

- **Dual AI Agent System**: Separate Interviewer and Assistant roles
- **Multiple Programming Languages**: Java, Python, JavaScript, C++, TypeScript, Go, Rust, SQL
- **Dynamic Question Formats**: MCQs, Code Analysis, Code Completion, DSA Challenges
- **Real-time Feedback**: Instant scoring and detailed explanations
- **Adaptive Difficulty**: Questions adjust based on performance
- **Modern UI**: Beautiful, responsive interface with animations

## 🤖 AI Agent Architecture

### 1. AI Interviewer (CopilotChat)
**Role**: Primary interviewer conducting formal technical interviews

**Responsibilities**:
- Conducts structured technical interviews
- Asks questions in specific formats (MCQ, Code Analysis, etc.)
- Provides scoring and feedback after each answer
- Adapts difficulty based on user performance
- Maintains professional interview atmosphere

**Question Formats**:
- 🚀 **MCQ Format**: Multiple choice questions with code snippets
- 📝 **Code Analysis**: Analyze code for bugs or behavior
- 🔧 **Code Completion**: Complete partial code implementations
- 🧠 **DSA Challenges**: Algorithm and data structure problems

### 2. AI Assistant (CopilotPopup)
**Role**: Helpful guide providing hints and guidance

**Responsibilities**:
- Provides hints when users are stuck
- Explains concepts in simple terms
- Offers code examples and explanations
- Breaks down complex problems
- Encourages learning without giving direct answers

**Key Features**:
- Never gives direct answers to interview questions
- Focuses on guidance and hints
- Explains core concepts clearly
- Supports multiple programming languages

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd interviewxp

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Environment Setup
Create a `.env.local` file with your AI service credentials:
```env
# Add your AI service API keys here
# Example: OPENAI_API_KEY=your_key_here
```

## 📁 Project Structure

```
project/
├── app/
│   ├── api/copilotkit/route.ts    # AI API endpoints
│   ├── globals.css                # Global styles
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Main application
├── components/
│   ├── CopilotSuggestions.tsx     # AI-powered suggestions
│   ├── InterviewChat.tsx          # Chat interface
│   ├── Interviewer.tsx            # Interview logic
│   ├── InterviewStats.tsx         # Performance tracking
│   ├── LanguageSelector.tsx       # Language selection
│   └── ui/                        # UI components
├── hooks/
│   └── use-interview-state.ts     # Interview state management
└── lib/
    └── utils.ts                   # Utility functions
```

## 🎨 UI Components

The application uses a modern, responsive design with:
- **Gradient backgrounds** and smooth animations
- **Card-based layouts** for clear information hierarchy
- **Interactive buttons** with hover effects
- **Real-time feedback** with scoring and progress tracking
- **Adaptive suggestions** based on performance

## 🔧 Configuration

### AI Prompts
The application uses two distinct prompts:

1. **Interviewer Prompt**: Structured for conducting formal interviews
2. **Assistant Prompt**: Designed for providing helpful guidance

Both prompts are defined in `app/page.tsx` and can be customized for different use cases.

### Language Support
Currently supports:
- JavaScript (ES6+, async programming)
- Python (Pythonic code, decorators)
- Java (OOP, collections framework)
- C++ (memory management, STL)
- TypeScript (type system, generics)
- Go (goroutines, channels)
- Rust (ownership, lifetimes)
- SQL (joins, optimization)

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Animations powered by [Framer Motion](https://www.framer.com/motion/)
- AI integration via [CopilotKit](https://copilotkit.ai/) 