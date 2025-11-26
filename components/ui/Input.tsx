'use client';

import React, { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, Search } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  shortcut?: string;
  error?: string;
  variant?: 'default' | 'search';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ icon: Icon = Search, shortcut, error, className = '', ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className="relative w-full">
        <motion.div
          className={`
            relative flex items-center gap-3
            bg-white/5 border rounded-xl
            transition-all duration-200
            ${isFocused 
              ? 'border-accent-energy shadow-glow-sm bg-white/8' 
              : 'border-white/10 hover:border-white/20'
            }
            ${error ? 'border-accent-plasma' : ''}
            ${className}
          `}
          animate={{
            boxShadow: isFocused 
              ? '0 0 20px rgba(0, 255, 163, 0.2)' 
              : '0 0 0px rgba(0, 255, 163, 0)',
          }}
        >
          {Icon && (
            <Icon className={`
              w-5 h-5 ml-4 transition-colors duration-200
              ${isFocused ? 'text-accent-energy' : 'text-white/40'}
            `} />
          )}
          
          <input
            ref={ref}
            className={`
              w-full py-3 pr-4 bg-transparent
              text-white placeholder-white/40
              outline-none
              ${shortcut ? 'pr-14' : ''}
            `}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          
          {shortcut && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <kbd className="px-2 py-1 text-xs font-mono bg-white/10 rounded-md text-white/50">
                {shortcut}
              </kbd>
            </div>
          )}
        </motion.div>
        
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm text-accent-plasma"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

