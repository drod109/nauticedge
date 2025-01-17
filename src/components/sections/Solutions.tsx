import React from 'react';
import { Anchor, Building2, Warehouse, ShieldCheck } from 'lucide-react';

const solutions = [
  {
    icon: Anchor,
    title: 'For Surveyors',
    description: 'Streamline your survey process with digital tools designed for marine professionals.',
    features: [
      'Mobile survey tools',
      'Custom report templates',
      'Client management',
      'Scheduling system'
    ]
  },
  {
    icon: Building2,
    title: 'For Marinas',
    description: 'Manage multiple vessels and maintain comprehensive inspection records.',
    features: [
      'Fleet management',
      'Maintenance tracking',
      'Dock planning',
      'Billing integration'
    ]
  },
  {
    icon: Warehouse,
    title: 'For Boat Yards',
    description: 'Track repairs, maintenance, and survey requirements for multiple vessels.',
    features: [
      'Work order management',
      'Progress tracking',
      'Photo documentation',
      'Customer portal'
    ]
  },
  {
    icon: ShieldCheck,
    title: 'For Insurers',
    description: 'Access detailed survey reports and manage risk assessments efficiently.',
    features: [
      'Standardized reports',
      'Risk assessment tools',
      'Claims integration',
      'Analytics dashboard'
    ]
  }
];

const Solutions = () => {
  return (
    <section id="solutions" className="py-24 bg-white dark:bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Solutions for Every Maritime Professional
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Tailored solutions to meet the unique needs of different maritime industry stakeholders
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {solutions.map((solution, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-dark-800 p-8 rounded-2xl hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
            >
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mr-4">
                  <solution.icon className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {solution.title}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {solution.description}
              </p>
              <ul className="space-y-3">
                {solution.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-700 dark:text-gray-300">
                    <span className="h-1.5 w-1.5 bg-blue-600 dark:bg-blue-500 rounded-full mr-3"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Solutions;