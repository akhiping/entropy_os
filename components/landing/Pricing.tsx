'use client';

import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';

interface PricingTier {
  name: string;
  description: string;
  priceMonthly: number;
  priceAnnual: number;
  features: string[];
  cta: string;
  ctaLink: string;
  popular?: boolean;
  variant: 'secondary' | 'primary';
}

const pricingTiers: PricingTier[] = [
  {
    name: 'Explorer',
    description: 'Perfect for trying Entropy and personal projects',
    priceMonthly: 0,
    priceAnnual: 0,
    features: [
      '2 integrations (GitHub + one other)',
      '50 nodes maximum',
      '100 AI credits/month',
      'Basic graph visualization',
      '7-day history',
      'Community support',
    ],
    cta: 'Get Started',
    ctaLink: '/auth/signup',
    variant: 'secondary',
  },
  {
    name: 'Builder',
    description: 'For individuals who want the full Entropy experience',
    priceMonthly: 12,
    priceAnnual: 10,
    features: [
      'Everything in Explorer',
      '5 integrations',
      '500 nodes',
      '1,000 AI credits/month',
      'Advanced graph features',
      '3 pre-built AI agents',
      '30-day history',
      'Email support',
      'Priority updates',
    ],
    cta: 'Start Free Trial',
    ctaLink: '/auth/signup?plan=plus',
    popular: true,
    variant: 'primary',
  },
  {
    name: 'Power User',
    description: 'For power users and teams who need everything',
    priceMonthly: 24,
    priceAnnual: 20,
    features: [
      'Everything in Builder',
      'Unlimited integrations',
      'Unlimited nodes',
      '5,000 AI credits/month',
      'Custom AI agents',
      'Real-time sync',
      '90-day history',
      'Priority support',
      'API access',
      'Export & backup',
    ],
    cta: 'Start Free Trial',
    ctaLink: '/auth/signup?plan=pro',
    variant: 'secondary',
  },
];

const faqs = [
  {
    question: 'Can I switch plans anytime?',
    answer: 'Yes! Upgrade or downgrade whenever you want. Changes take effect at the start of your next billing cycle.',
  },
  {
    question: 'What counts as an AI credit?',
    answer: 'Each AI interaction uses credits based on complexity. A simple summary uses ~5 credits, while a full workspace analysis uses ~50 credits. Your monthly allocation resets on your billing date.',
  },
  {
    question: 'Is there a free trial?',
    answer: 'Yes! Plus and Pro plans include a 14-day free trial. No credit card required.',
  },
  {
    question: 'What integrations do you support?',
    answer: 'Currently: GitHub, Notion, Slack, Google Drive, Linear, Jira, and more coming soon. Check our docs for the full list.',
  },
  {
    question: 'Can I export my data?',
    answer: 'Absolutely. Your data is yours. Export anytime as JSON, CSV, or images. Pro plan includes API access for custom exports.',
  },
  {
    question: 'Do you offer student or nonprofit discounts?',
    answer: 'Yes! Students and nonprofits get 50% off Plus and Pro plans. Contact us with verification.',
  },
];

const PricingCard: React.FC<{ tier: PricingTier; isAnnual: boolean; index: number }> = ({
  tier,
  isAnnual,
  index,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });

  const price = isAnnual ? tier.priceAnnual : tier.priceMonthly;
  const showSavings = isAnnual && tier.priceMonthly !== tier.priceAnnual;

  return (
    <motion.div
      ref={cardRef}
      className="relative h-full"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Popular badge */}
      {tier.popular && (
        <motion.div
          className="absolute -top-4 left-1/2 -translate-x-1/2 z-20"
          initial={{ opacity: 0, y: -10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
          transition={{ delay: 0.3 }}
        >
          <div className="px-4 py-1.5 rounded-full bg-accent-energy text-bg-void text-xs font-bold tracking-wide">
            MOST POPULAR
          </div>
        </motion.div>
      )}

      <div
        className={`relative h-full p-10 rounded-3xl backdrop-blur-xl overflow-hidden transition-all duration-300 ${
          tier.popular
            ? 'bg-accent-energy/[0.08] border-2 border-accent-energy scale-105 shadow-[0_0_40px_rgba(0,255,163,0.2)]'
            : 'bg-white/[0.05] border border-white/10 hover:border-white/20'
        }`}
      >
        {/* Plan name */}
        <h3 className="text-3xl font-bold text-white mb-2">{tier.name}</h3>

        {/* Price */}
        <div className="mb-3">
          <div className="flex items-baseline gap-2">
            <motion.span
              key={price}
              className="text-5xl font-bold text-white"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              ${price}
            </motion.span>
            <span className="text-lg text-white/60">/month</span>
          </div>
          {showSavings && (
            <motion.p
              className="text-sm text-accent-energy mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              ${tier.priceAnnual * 12}/year · Save ${(tier.priceMonthly - tier.priceAnnual) * 12}
            </motion.p>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-white/70 mb-6">{tier.description}</p>

        {/* CTA Button */}
        <motion.a
          href={tier.ctaLink}
          className={`block w-full py-3.5 px-6 rounded-xl font-semibold text-center transition-all duration-200 mb-8 ${
            tier.variant === 'primary'
              ? 'bg-accent-energy text-bg-void hover:shadow-[0_0_30px_rgba(0,255,163,0.3)]'
              : 'bg-white/10 text-white border border-white/20 hover:bg-white/15'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {tier.cta}
        </motion.a>

        {/* Divider */}
        <div className="h-px bg-white/10 mb-8" />

        {/* Features list */}
        <ul className="space-y-4">
          {tier.features.map((feature, i) => (
            <motion.li
              key={i}
              className="flex items-start gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              transition={{ delay: 0.1 * i }}
            >
              <Check className="w-5 h-5 text-accent-energy flex-shrink-0 mt-0.5" />
              <span className="text-sm text-white/80">{feature}</span>
            </motion.li>
          ))}
        </ul>

        {/* Glow effect */}
        {tier.popular && (
          <div className="absolute -inset-40 bg-gradient-to-br from-accent-energy/20 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        )}
      </div>
    </motion.div>
  );
};

const FAQItem: React.FC<{ faq: { question: string; answer: string }; index: number }> = ({
  faq,
  index,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className="border-b border-white/10 last:border-b-0"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
    >
      <button
        className="w-full py-6 flex items-center justify-between text-left hover:text-accent-energy transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-medium text-white pr-8">{faq.question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5 text-white/60" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="text-white/70 pb-6 leading-relaxed">{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const Pricing: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="relative py-32 px-6 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f1a] via-bg-void to-bg-void" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-white/70">
            Start free, upgrade when you need more power
          </p>
        </motion.div>

        {/* Billing toggle */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-16"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ delay: 0.2 }}
        >
          <span className={`text-base ${!isAnnual ? 'text-white' : 'text-white/50'}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${
              isAnnual ? 'bg-accent-energy' : 'bg-white/20'
            }`}
          >
            <motion.div
              className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg"
              animate={{ left: isAnnual ? 'calc(100% - 28px)' : '4px' }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
          <span className={`text-base ${isAnnual ? 'text-white' : 'text-white/50'}`}>
            Annual
          </span>
          {isAnnual && (
            <motion.span
              className="ml-2 px-3 py-1 rounded-full bg-accent-energy/20 text-accent-energy text-sm font-medium"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              Save 20%
            </motion.span>
          )}
        </motion.div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {pricingTiers.map((tier, index) => (
            <PricingCard key={tier.name} tier={tier} isAnnual={isAnnual} index={index} />
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-4xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h3>
          <div className="bg-white/[0.03] backdrop-blur-lg rounded-2xl border border-white/10 p-8">
            {faqs.map((faq, index) => (
              <FAQItem key={index} faq={faq} index={index} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;

