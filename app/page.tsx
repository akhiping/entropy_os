'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import GraphPreview from '@/components/landing/GraphPreview';
import Features from '@/components/landing/Features';

// Footer component
const Footer: React.FC = () => {
  return (
    <footer className="relative py-12 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent-energy to-accent-frost" />
          <span className="text-white/40 text-sm">
            © 2025 Entropy • Built for the future of work
          </span>
        </div>
        
        <div className="flex items-center gap-6">
          <a href="#" className="text-sm text-white/40 hover:text-white transition-colors">
            Privacy
          </a>
          <a href="#" className="text-sm text-white/40 hover:text-white transition-colors">
            Terms
          </a>
          <a href="#" className="text-sm text-white/40 hover:text-white transition-colors">
            Twitter
          </a>
          <a href="#" className="text-sm text-white/40 hover:text-white transition-colors">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-bg-void overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 bg-mesh-animated pointer-events-none" />
      
      {/* Noise texture overlay */}
      <div 
        className="fixed inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Navigation */}
      <Navbar />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Graph Preview */}
      <section className="relative py-12 px-6">
        <GraphPreview />
      </section>
      
      {/* Features Section */}
      <Features />
      
      {/* Call to Action Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Glowing orb */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent-energy/10 rounded-full blur-[100px] pointer-events-none"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Ready to see your
              <br />
              <span className="gradient-text-energy">digital universe</span>?
            </h2>
            
            <p className="text-lg text-white/50 mb-10 max-w-xl mx-auto">
              Join thousands of developers and knowledge workers who&apos;ve transformed
              how they work. Start for free, no credit card required.
            </p>
            
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <motion.a
                href="/auth/signup"
                className="inline-flex items-center gap-2 px-8 py-4 bg-accent-energy text-bg-void font-semibold rounded-xl hover:shadow-glow-md transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started Free
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </motion.a>
              
              <motion.a
                href="#"
                className="inline-flex items-center gap-2 px-8 py-4 text-white/70 font-medium hover:text-white transition-colors"
                whileHover={{ x: 5 }}
              >
                Schedule a demo
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </main>
  );
}
