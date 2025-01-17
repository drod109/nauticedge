import React from 'react';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Basic',
    price: 49,
    description: 'Perfect for independent surveyors',
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
    price: 99,
    description: 'Ideal for growing survey businesses',
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
    price: 249,
    description: 'For large organizations and fleets',
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
  return (
    <section id="pricing" className="py-24 bg-gray-50 dark:bg-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Choose the perfect plan for your needs. All plans include core features with no hidden fees
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden ${
                plan.popular ? 'ring-2 ring-blue-600 scale-105' : ''
              } dark:bg-dark-800 dark:border-dark-700`}
            >
              {plan.popular && (
                <div className="bg-blue-600 text-white text-center text-sm py-1.5">
                  Most Popular
                </div>
              )}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">${plan.price}</span>
                  <span className="text-gray-600 dark:text-gray-400">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 dark:text-green-400 mr-3 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-dark-700 dark:text-white dark:hover:bg-dark-600'
                  }`}
                >
                  Get Started
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