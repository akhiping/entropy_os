'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  ArrowLeft,
  User,
  Github,
  Chrome,
  Check,
  Sparkles,
} from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/animations';

// Productivity tools for onboarding
const productivityTools = [
  {
    id: 'github',
    name: 'GitHub',
    description: 'Connect your repositories and track code changes',
    icon: '/icons/github.svg',
    color: '#6e5494',
    bgColor: 'rgba(110, 84, 148, 0.2)',
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Import your notes, docs, and databases',
    icon: '/icons/notion.svg',
    color: '#000000',
    bgColor: 'rgba(255, 255, 255, 0.1)',
  },
  {
    id: 'jira',
    name: 'Jira',
    description: 'Sync issues, sprints, and project boards',
    icon: '/icons/jira.svg',
    color: '#0052CC',
    bgColor: 'rgba(0, 82, 204, 0.2)',
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Connect conversations and channels',
    icon: '/icons/slack.svg',
    color: '#4A154B',
    bgColor: 'rgba(74, 21, 75, 0.2)',
  },
  {
    id: 'linear',
    name: 'Linear',
    description: 'Import issues and project roadmaps',
    icon: '/icons/linear.svg',
    color: '#5E6AD2',
    bgColor: 'rgba(94, 106, 210, 0.2)',
  },
  {
    id: 'figma',
    name: 'Figma',
    description: 'Connect design files and components',
    icon: '/icons/figma.svg',
    color: '#F24E1E',
    bgColor: 'rgba(242, 78, 30, 0.2)',
  },
  {
    id: 'google-drive',
    name: 'Google Drive',
    description: 'Import docs, sheets, and presentations',
    icon: '/icons/gdrive.svg',
    color: '#4285F4',
    bgColor: 'rgba(66, 133, 244, 0.2)',
  },
  {
    id: 'trello',
    name: 'Trello',
    description: 'Sync boards, cards, and checklists',
    icon: '/icons/trello.svg',
    color: '#0079BF',
    bgColor: 'rgba(0, 121, 191, 0.2)',
  },
];

// Simple icon components for tools
const ToolIcon: React.FC<{ id: string; color: string }> = ({ id, color }) => {
  const iconMap: Record<string, React.ReactNode> = {
    github: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
    notion: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.166V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.934zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.14c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"/>
      </svg>
    ),
    jira: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005zm5.723-5.756H5.736a5.215 5.215 0 0 0 5.215 5.214h2.129v2.058a5.218 5.218 0 0 0 5.215 5.214V6.758a1.001 1.001 0 0 0-1.001-1.001zM23.013 0H11.455a5.215 5.215 0 0 0 5.215 5.215h2.129v2.057A5.215 5.215 0 0 0 24 12.483V1.005A1.005 1.005 0 0 0 23.013 0z"/>
      </svg>
    ),
    slack: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
      </svg>
    ),
    linear: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M3.707 3.707a1 1 0 0 0 0 1.414l15.172 15.172a1 1 0 0 0 1.414-1.414L5.121 3.707a1 1 0 0 0-1.414 0zM1.414 7.536a1 1 0 0 0 0 1.414l13.536 13.536a1 1 0 0 0 1.414-1.414L2.828 7.536a1 1 0 0 0-1.414 0zM7.536 1.414a1 1 0 0 0-1.414 1.414l13.536 13.536a1 1 0 0 0 1.414-1.414L7.536 1.414z"/>
      </svg>
    ),
    figma: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zM8.148 24c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v4.49c0 2.476-2.014 4.49-4.588 4.49zm0-7.51a3.023 3.023 0 0 0-3.019 3.019A3.023 3.023 0 0 0 8.148 22.529a3.023 3.023 0 0 0 3.019-3.019v-3.019H8.148zM8.148 8.981c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981H8.148zm0-7.51a3.023 3.023 0 0 0-3.019 3.019 3.023 3.023 0 0 0 3.019 3.019h3.117V1.471H8.148zM8.148 15.02c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.981H8.148zm0-7.51a3.023 3.023 0 0 0-3.019 3.019 3.023 3.023 0 0 0 3.019 3.019h3.117V7.51H8.148zM15.852 15.02c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49 4.49 2.014 4.49 4.49-2.014 4.49-4.49 4.49zm0-7.51a3.023 3.023 0 0 0-3.019 3.019 3.023 3.023 0 0 0 3.019 3.019 3.023 3.023 0 0 0 3.019-3.019 3.023 3.023 0 0 0-3.019-3.019z"/>
      </svg>
    ),
    'google-drive': (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M7.71 3.5L1.15 15l3.43 5.95L11.14 9.45M8.57 21.05h12L24 15H11.99M22.29 14.5L15.43 3.5H8.57l6.86 11"/>
      </svg>
    ),
    trello: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M21 0H3C1.343 0 0 1.343 0 3v18c0 1.656 1.343 3 3 3h18c1.656 0 3-1.344 3-3V3c0-1.657-1.344-3-3-3zM10.44 18.18c0 .795-.645 1.44-1.44 1.44H4.56c-.795 0-1.44-.646-1.44-1.44V4.56c0-.795.645-1.44 1.44-1.44H9c.795 0 1.44.645 1.44 1.44v13.62zm10.44-6c0 .794-.645 1.44-1.44 1.44H15c-.795 0-1.44-.646-1.44-1.44V4.56c0-.795.646-1.44 1.44-1.44h4.44c.795 0 1.44.645 1.44 1.44v7.62z"/>
      </svg>
    ),
  };

  return (
    <div className="w-6 h-6 flex items-center justify-center" style={{ color }}>
      {iconMap[id] || <div className="w-6 h-6 rounded bg-white/20" />}
    </div>
  );
};

type Step = 'account' | 'tools';

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('account');
  
  // Account form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Tools selection state
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setStep('tools');
  };

  const toggleTool = (toolId: string) => {
    setSelectedTools((prev) =>
      prev.includes(toolId)
        ? prev.filter((id) => id !== toolId)
        : [...prev, toolId]
    );
  };

  const handleComplete = async () => {
    setIsLoading(true);
    
    // Simulate account creation
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Navigate to dashboard
    router.push('/dashboard');
  };

  const handleSocialSignup = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStep('tools');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-bg-void flex items-center justify-center px-6 py-12">
      {/* Background */}
      <div className="fixed inset-0 bg-mesh-animated pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-radial from-accent-energy/5 via-transparent to-transparent pointer-events-none" />

      <motion.div
        className="relative z-10 w-full max-w-xl"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Logo */}
        <motion.div variants={staggerItem} className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-energy via-accent-frost to-accent-void flex items-center justify-center">
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="3" fill="currentColor" />
                <circle cx="12" cy="4" r="2" fill="currentColor" />
                <circle cx="12" cy="20" r="2" fill="currentColor" />
                <circle cx="4" cy="12" r="2" fill="currentColor" />
                <circle cx="20" cy="12" r="2" fill="currentColor" />
                <path d="M12 7V9M12 15V17M9 12H7M17 12H15" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-white group-hover:text-accent-energy transition-colors">
              Entropy
            </span>
          </Link>
        </motion.div>

        {/* Progress indicator */}
        <motion.div variants={staggerItem} className="flex items-center justify-center gap-2 mb-8">
          <div className={`w-3 h-3 rounded-full transition-colors ${step === 'account' ? 'bg-accent-energy' : 'bg-accent-energy/30'}`} />
          <div className="w-16 h-0.5 bg-white/10">
            <motion.div
              className="h-full bg-accent-energy"
              initial={{ width: '0%' }}
              animate={{ width: step === 'tools' ? '100%' : '0%' }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className={`w-3 h-3 rounded-full transition-colors ${step === 'tools' ? 'bg-accent-energy' : 'bg-white/20'}`} />
        </motion.div>

        {/* Card */}
        <motion.div
          variants={staggerItem}
          className="bg-bg-elevated/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-dramatic overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {step === 'account' && (
              <motion.div
                key="account"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-8"
              >
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
                  <p className="text-white/50">Start your journey with Entropy</p>
                </div>

                {/* Social Signup */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <motion.button
                    onClick={() => handleSocialSignup()}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 hover:border-white/20 transition-all disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Github className="w-5 h-5" />
                    <span className="font-medium">GitHub</span>
                  </motion.button>
                  <motion.button
                    onClick={() => handleSocialSignup()}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 hover:border-white/20 transition-all disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Chrome className="w-5 h-5" />
                    <span className="font-medium">Google</span>
                  </motion.button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-white/40 text-sm">or</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                {/* Form */}
                <form onSubmit={handleAccountSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Full name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-accent-energy/50 focus:ring-1 focus:ring-accent-energy/30 transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-accent-energy/50 focus:ring-1 focus:ring-accent-energy/30 transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 8 characters"
                        className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-accent-energy/50 focus:ring-1 focus:ring-accent-energy/30 transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-accent-plasma/10 border border-accent-plasma/30 rounded-xl text-accent-plasma text-sm"
                    >
                      {error}
                    </motion.div>
                  )}

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-accent-energy text-bg-void font-semibold rounded-xl hover:shadow-glow-md transition-all disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Continue
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </form>

                {/* Sign In Link */}
                <p className="mt-6 text-center text-white/50">
                  Already have an account?{' '}
                  <Link
                    href="/auth/signin"
                    className="text-accent-energy hover:text-accent-energy/80 font-medium transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </motion.div>
            )}

            {step === 'tools' && (
              <motion.div
                key="tools"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="p-8"
              >
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent-energy/10 border border-accent-energy/20 mb-4">
                    <Sparkles className="w-7 h-7 text-accent-energy" />
                  </div>
                  <h1 className="text-2xl font-bold text-white mb-2">Connect your tools</h1>
                  <p className="text-white/50">Select the tools you use daily. You can always add more later.</p>
                </div>

                {/* Tools Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {productivityTools.map((tool) => {
                    const isSelected = selectedTools.includes(tool.id);
                    return (
                      <motion.button
                        key={tool.id}
                        onClick={() => toggleTool(tool.id)}
                        className={`
                          relative flex items-start gap-3 p-4 rounded-xl border text-left transition-all
                          ${isSelected
                            ? 'bg-accent-energy/10 border-accent-energy/50'
                            : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
                          }
                        `}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                          style={{ backgroundColor: tool.bgColor }}
                        >
                          <ToolIcon id={tool.id} color={tool.color} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-medium text-sm">{tool.name}</h3>
                          <p className="text-white/40 text-xs line-clamp-2">{tool.description}</p>
                        </div>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2 w-5 h-5 rounded-full bg-accent-energy flex items-center justify-center"
                          >
                            <Check className="w-3 h-3 text-bg-void" />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Selected count */}
                <p className="text-center text-white/40 text-sm mb-6">
                  {selectedTools.length} tool{selectedTools.length !== 1 ? 's' : ''} selected
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                  <motion.button
                    onClick={() => setStep('account')}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </motion.button>
                  <motion.button
                    onClick={handleComplete}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-accent-energy text-bg-void font-semibold rounded-xl hover:shadow-glow-md transition-all disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <motion.div
                        className="w-5 h-5 border-2 border-bg-void/30 border-t-bg-void rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                    ) : (
                      <>
                        {selectedTools.length > 0 ? 'Complete Setup' : 'Skip for now'}
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <motion.p
          variants={staggerItem}
          className="mt-8 text-center text-white/30 text-sm"
        >
          By signing up, you agree to our{' '}
          <Link href="#" className="text-white/50 hover:text-white/70">Terms</Link>
          {' '}and{' '}
          <Link href="#" className="text-white/50 hover:text-white/70">Privacy Policy</Link>
        </motion.p>
      </motion.div>
    </div>
  );
}

