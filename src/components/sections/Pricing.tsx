import React, { useState } from 'react';
import { Check, Zap, Shield, Users, ArrowRight } from 'lucide-react';
import PricingToggle from './pricing/PricingToggle';

const plans = [
  {
    name: 'Basic',
    monthlyPrice: 49,
    annualPrice: 39,
    description: 'Perfect for independent surveyors',
    icon: Zap,
    features: [
      'Up to 20 surveys per month',
      'Basic report templates',
      'Mobile app access',
      'Email support',
      '5GB storage',
      'Basic analytics'
    ]
  },
  {
    name: 'Professional',
    monthlyPrice: 99,
    annualPrice: 79,
    description: 'Ideal for growing survey businesses',
    icon: Shield,
    features: [
      'Unlimited surveys',
      'Custom report templates',
      'Priority mobile app access',
      'Priority support',
      '50GB storage',
      'Advanced analytics',
      'Team collaboration',
      'API access'
    ],
    popular: true
  },
  {
    name: 'Enterprise',
    monthlyPrice: 249,
    annualPrice: 199,
    description: 'For large organizations and fleets',
    icon: Users,
    features: [
      'Unlimited everything',
      'White-label reports',
      'Dedicated mobile app',
      '24/7 phone support',
      'Unlimited storage',
      'Custom analytics',
      'Advanced team management',
      'Custom API integration',
      'SLA guarantee'
    ]
  }
];

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section id="pricing" className="py-24 bg-gradient-to-b from-white via-gray-50 to-white dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[800px] h-[800px] -top-96 -left-96 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute w-[800px] h-[800px] -bottom-96 -right-96 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-20 animate-blob"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-white dark:via-blue-400 dark:to-white animate-gradient mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Choose the perfect plan for your needs. All plans include core features with no hidden fees
          </p>
          <div className="mt-8">
            <PricingToggle isAnnual={isAnnual} onToggle={setIsAnnual} />
          </div>
        </div>

        <div className="flex flex-col md:flex-row max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index} 
              className={`group flex-1 bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm overflow-hidden animate-fade-in-up hover:-translate-y-2 transition-all duration-300 ${
                index === 0 ? 'md:rounded-r-none' : 
                index === plans.length - 1 ? 'md:rounded-l-none' : 'md:rounded-none',
                plan.popular
                  ? 'rounded-lg border-2 border-blue-500 dark:border-blue-400 scale-105 shadow-xl relative z-10 md:-mx-4'
                  : 'rounded-lg border border-gray-200/50 dark:border-dark-700/50 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-xl md:first:border-r-0 md:last:border-l-0'
              }`} 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.popular && (
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-400 text-white text-center text-sm py-1.5 animate-gradient">
                  Most Popular
                </div>
              )}
              <div className="p-8">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                    <plan.icon className="h-5 w-5 text-blue-600 dark:text-blue-500 group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{plan.name}</h3>
                    <div className="text-sm">
                      <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300 bg-clip-text text-transparent">${isAnnual ? plan.annualPrice : plan.monthlyPrice}</span>
                      <span className="text-gray-500 dark:text-gray-400">/month</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 my-6">{plan.description}</p>
                <div className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-700 dark:text-gray-300">
                      <Check className="h-5 w-5 text-blue-600 dark:text-blue-500 mr-3 group-hover:scale-110 transition-transform" />
                      {feature}
                    </li>
                  ))}
                </div>
                <button
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors mt-8 ${
                    plan.popular
                      ? 'relative group/button overflow-hidden bg-gradient-to-r from-blue-600 to-blue-400 text-white hover:from-blue-500 hover:to-blue-300 shadow-lg hover:shadow-xl'
                      : 'bg-white text-gray-900 hover:bg-gray-50 dark:bg-dark-700 dark:text-white dark:hover:bg-dark-600 border border-gray-200 dark:border-dark-600 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-lg'
                  }`}
                >
                  {plan.popular ? (
                    <>
                      <span className="flex items-center justify-center">
                        Get Started
                        <ArrowRight className="ml-2 h-5 w-5 transform group-hover/button:translate-x-1 transition-transform" />
                      </span>
                    </>
                  ) : (
                    <span className="flex items-center justify-center">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
                    </span>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;