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
    <section id="solutions" className="py-24 bg-gradient-to-br from-white via-gray-50 to-white dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[800px] h-[800px] -top-96 -right-96 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute w-[800px] h-[800px] -bottom-96 -left-96 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-white dark:via-blue-400 dark:to-white animate-gradient mb-4">
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
              className="group bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-200/50 dark:border-dark-700/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center mb-6 relative">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl flex items-center justify-center mr-4 transform group-hover:scale-110 transition-transform duration-300">
                  <solution.icon className="h-6 w-6 text-blue-600 dark:text-blue-500 transform group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {solution.title}
                </h3>
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl opacity-0 group-hover:opacity-20 dark:group-hover:opacity-10 blur transition-opacity duration-300"></div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {solution.description}
              </p>
              <ul className="space-y-3">
                {solution.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-700 dark:text-gray-300">
                    <span className="h-1.5 w-1.5 bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
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