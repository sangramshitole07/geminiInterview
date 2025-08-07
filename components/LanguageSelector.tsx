'use client';

import { motion } from 'framer-motion';
import { Code, Zap, Target, Cpu, Database, Globe, Shield, Rocket } from 'lucide-react';

interface Language {
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

const languages: Language[] = [
  {
    name: 'JavaScript',
    icon: <Code className="w-8 h-8" />,
    color: 'from-yellow-400 to-orange-500',
    description: 'Web development & Node.js',
    difficulty: 'Beginner'
  },
  {
    name: 'Python',
    icon: <Zap className="w-8 h-8" />,
    color: 'from-blue-400 to-green-500',
    description: 'Data science & Backend',
    difficulty: 'Beginner'
  },
  {
    name: 'Java',
    icon: <Target className="w-8 h-8" />,
    color: 'from-red-400 to-red-600',
    description: 'Enterprise & Android',
    difficulty: 'Intermediate'
  },
  {
    name: 'C++',
    icon: <Cpu className="w-8 h-8" />,
    color: 'from-blue-600 to-purple-600',
    description: 'Systems & Performance',
    difficulty: 'Advanced'
  },
  {
    name: 'TypeScript',
    icon: <Code className="w-8 h-8" />,
    color: 'from-blue-500 to-blue-700',
    description: 'Type-safe JavaScript',
    difficulty: 'Intermediate'
  },
  {
    name: 'Go',
    icon: <Rocket className="w-8 h-8" />,
    color: 'from-cyan-500 to-blue-600',
    description: 'Cloud & Microservices',
    difficulty: 'Intermediate'
  },
  {
    name: 'Rust',
    icon: <Shield className="w-8 h-8" />,
    color: 'from-orange-500 to-red-600',
    description: 'Memory safety & Performance',
    difficulty: 'Advanced'
  },
  {
    name: 'SQL',
    icon: <Database className="w-8 h-8" />,
    color: 'from-green-500 to-blue-600',
    description: 'Database & Data Analysis',
    difficulty: 'Beginner'
  },
];

interface LanguageSelectorProps {
  onSelect: (language: string) => void;
}

export function LanguageSelector({ onSelect }: LanguageSelectorProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700 border-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Choose Your Interview Language
        </h2>
        <p className="text-gray-600">
          Select a programming language to begin your technical interview
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {languages.map((language, index) => (
          <motion.button
            key={language.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(language.name)}
            className="group relative overflow-hidden rounded-xl p-6 bg-white border border-gray-200 hover:border-transparent hover:shadow-xl transition-all duration-300"
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${language.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${language.color} text-white`}>
                  {language.icon}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(language.difficulty)}`}>
                  {language.difficulty}
                </span>
              </div>
              
              <div className="text-left">
                <h3 className="font-semibold text-lg text-gray-800 group-hover:text-gray-900 mb-1">
                  {language.name}
                </h3>
                <p className="text-sm text-gray-600 group-hover:text-gray-700">
                  {language.description}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}