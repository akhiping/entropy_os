'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';

export default function DocsPage() {
  return (
    <main className="relative min-h-screen bg-bg-void flex items-center justify-center px-6">
      {/* Background */}
      <div className="fixed inset-0 bg-mesh-animated pointer-events-none" />
      
      <motion.div
        className="relative z-10 max-w-2xl mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="w-20 h-20 rounded-2xl bg-accent-energy/10 border border-accent-energy/20 flex items-center justify-center mx-auto mb-8"
          animate={{
            boxShadow: [
              '0 0 0px rgba(0,255,163,0)',
              '0 0 40px rgba(0,255,163,0.3)',
              '0 0 0px rgba(0,255,163,0)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <BookOpen className="w-10 h-10 text-accent-energy" />
        </motion.div>

        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Documentation
          <br />
          <span className="gradient-text-energy">Coming Soon</span>
        </h1>

        <p className="text-xl text-white/70 mb-12 leading-relaxed">
          We&apos;re working hard on comprehensive documentation to help you get the most out of Entropy. Check back soon!
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/"
              className="inline-flex items-center gap-3 px-8 py-4 bg-accent-energy text-bg-void font-semibold rounded-xl hover:shadow-glow-md transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 border border-white/20 text-white font-medium rounded-xl hover:bg-white/15 transition-all"
            >
              Go to Dashboard
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}

