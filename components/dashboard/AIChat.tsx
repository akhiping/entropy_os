'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  Send,
  MoreHorizontal,
  Copy,
  RefreshCw,
  Edit,
  MessageSquare,
  Zap,
  Search,
  FileText,
  BarChart,
} from 'lucide-react';
import { useGraphStore, useSelectedNode } from '@/lib/store';
import { ChatMessage } from '@/lib/types';
import { modalBackdrop, modalContent, staggerContainer, staggerItem } from '@/lib/animations';

const SuggestedAction: React.FC<{
  icon: React.ElementType;
  text: string;
  onClick: () => void;
}> = ({ icon: Icon, text, onClick }) => (
  <motion.button
    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20 hover:text-white transition-all text-sm"
    onClick={onClick}
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
  >
    <Icon className="w-4 h-4" />
    {text}
  </motion.button>
);

const ChatBubble: React.FC<{
  message: ChatMessage;
  onCopy: () => void;
}> = ({ message, onCopy }) => {
  const isUser = message.role === 'user';
  const [showActions, setShowActions] = useState(false);

  return (
    <motion.div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className={`relative max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        {/* Avatar for AI */}
        {!isUser && (
          <div className="absolute -left-12 top-0 w-8 h-8 rounded-full bg-gradient-to-br from-accent-void to-accent-plasma flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        )}

        {/* Message bubble */}
        <div
          className={`
            relative px-4 py-3 rounded-2xl
            ${isUser
              ? 'bg-accent-energy/15 border border-accent-energy/30 rounded-br-md text-white/90'
              : 'bg-gradient-to-br from-accent-void/20 to-accent-plasma/10 border border-accent-void/20 rounded-bl-md text-white/80'
            }
          `}
        >
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>

          {/* Code blocks would be rendered here with syntax highlighting */}
        </div>

        {/* Action buttons */}
        <AnimatePresence>
          {showActions && (
            <motion.div
              className={`absolute top-0 ${isUser ? 'left-0 -translate-x-full pr-2' : 'right-0 translate-x-full pl-2'} flex items-center gap-1`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <button
                className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                onClick={onCopy}
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              {!isUser && (
                <button className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors">
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              )}
              {isUser && (
                <button className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors">
                  <Edit className="w-3.5 h-3.5" />
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Timestamp */}
        <p className={`text-xs text-white/30 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </motion.div>
  );
};

const TypingIndicator: React.FC = () => (
  <motion.div
    className="flex items-center gap-3"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
  >
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-void to-accent-plasma flex items-center justify-center">
      <Sparkles className="w-4 h-4 text-white" />
    </div>
    <div className="flex items-center gap-1 px-4 py-3 rounded-2xl rounded-bl-md bg-gradient-to-br from-accent-void/20 to-accent-plasma/10 border border-accent-void/20">
      <motion.span
        className="w-2 h-2 bg-accent-void rounded-full"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0 }}
      />
      <motion.span
        className="w-2 h-2 bg-accent-void rounded-full"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
      />
      <motion.span
        className="w-2 h-2 bg-accent-void rounded-full"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
      />
    </div>
  </motion.div>
);

export const AIChat: React.FC = () => {
  const { showAIChat, toggleAIChat, chatMessages, addChatMessage, isAITyping, setAITyping } = useGraphStore();
  const selectedNode = useSelectedNode();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAITyping]);

  // Focus input on open
  useEffect(() => {
    if (showAIChat) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [showAIChat]);

  const simulateAIResponse = useCallback(async (userMessage: string) => {
    setAITyping(true);
    
    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const responses = [
      `Based on my analysis of your workspace, I can see that "${userMessage}" relates to several connected items. Your entropy-core repository has been very active lately with 8 recent commits. Would you like me to dive deeper into any specific aspect?`,
      `I've analyzed your workspace context. The items connected to this query show interesting patterns - there are 5 documents and 3 tasks that might be relevant. I notice some potential connections you might have missed between your API documentation and the recent task updates.`,
      `Looking at your knowledge graph, I can see this touches on multiple areas: your core infrastructure, documentation, and several ongoing tasks. The Research Assistant agent has been gathering relevant information that might help. Shall I summarize the key insights?`,
    ];
    
    const response: ChatMessage = {
      id: `ai-${Date.now()}`,
      role: 'assistant',
      content: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date(),
    };
    
    setAITyping(false);
    addChatMessage(response);
  }, [setAITyping, addChatMessage]);

  const handleSend = useCallback(() => {
    if (!inputValue.trim()) return;
    
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };
    
    addChatMessage(userMessage);
    setInputValue('');
    simulateAIResponse(inputValue);
  }, [inputValue, addChatMessage, simulateAIResponse]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setTimeout(() => {
      handleSend();
    }, 100);
  };

  return (
    <AnimatePresence>
      {showAIChat && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-bg-void/60 backdrop-blur-sm z-50"
            variants={modalBackdrop}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={toggleAIChat}
          />

          {/* Modal */}
          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[600px] max-h-[80vh] bg-bg-deep/98 backdrop-blur-xl rounded-3xl border border-white/15 shadow-dramatic z-50 overflow-hidden flex flex-col"
            variants={modalContent}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent-void to-accent-plasma blur-lg opacity-50"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-accent-void to-accent-plasma flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">AI Assistant</h2>
                  <p className="text-xs text-white/40">Ask about your workspace</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
                <motion.button
                  className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                  onClick={toggleAIChat}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {chatMessages.length === 0 ? (
                <motion.div
                  className="h-full flex flex-col items-center justify-center text-center"
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                >
                  <motion.div
                    variants={staggerItem}
                    className="w-20 h-20 rounded-3xl bg-gradient-to-br from-accent-void/20 to-accent-plasma/10 border border-accent-void/20 flex items-center justify-center mb-6"
                  >
                    <MessageSquare className="w-10 h-10 text-accent-void" />
                  </motion.div>
                  <motion.h3 variants={staggerItem} className="text-xl font-semibold text-white mb-2">
                    How can I help you today?
                  </motion.h3>
                  <motion.p variants={staggerItem} className="text-white/50 mb-8 max-w-sm">
                    Ask me anything about your workspace, connections, or let me help you discover insights.
                  </motion.p>
                  
                  {/* Context hint if node is selected */}
                  {selectedNode && (
                    <motion.div
                      variants={staggerItem}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-energy/10 border border-accent-energy/20 text-accent-energy text-sm mb-6"
                    >
                      <Zap className="w-4 h-4" />
                      Asking about: {selectedNode.title}
                    </motion.div>
                  )}
                  
                  {/* Suggested actions */}
                  <motion.div variants={staggerItem} className="flex flex-wrap justify-center gap-2">
                    <SuggestedAction
                      icon={Search}
                      text="Summarize my workspace"
                      onClick={() => handleSuggestionClick('Summarize my workspace')}
                    />
                    <SuggestedAction
                      icon={Zap}
                      text="What's blocking me?"
                      onClick={() => handleSuggestionClick("What's blocking me?")}
                    />
                    <SuggestedAction
                      icon={FileText}
                      text="Find connections"
                      onClick={() => handleSuggestionClick('Find connections I might be missing')}
                    />
                    <SuggestedAction
                      icon={BarChart}
                      text="Weekly report"
                      onClick={() => handleSuggestionClick('Generate a weekly report')}
                    />
                  </motion.div>
                </motion.div>
              ) : (
                <>
                  {chatMessages.map((message) => (
                    <ChatBubble
                      key={message.id}
                      message={message}
                      onCopy={() => navigator.clipboard.writeText(message.content)}
                    />
                  ))}
                  {isAITyping && <TypingIndicator />}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="p-4 border-t border-white/10">
              <div className="relative">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything about your workspace..."
                  className="w-full min-h-[60px] max-h-[200px] px-4 py-3 pr-14 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 resize-none focus:outline-none focus:border-accent-energy focus:ring-1 focus:ring-accent-energy/50 transition-all"
                  rows={1}
                />
                <motion.button
                  className={`absolute right-3 bottom-3 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    inputValue.trim()
                      ? 'bg-accent-energy text-bg-void'
                      : 'bg-white/10 text-white/30 cursor-not-allowed'
                  }`}
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  whileHover={inputValue.trim() ? { scale: 1.05, rotate: 15 } : {}}
                  whileTap={inputValue.trim() ? { scale: 0.95 } : {}}
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
              <p className="text-xs text-white/30 mt-2 text-center">
                Press Enter to send • Shift+Enter for new line
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AIChat;

