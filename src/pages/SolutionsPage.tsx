import React from 'react';
import { Anchor, Building2, Warehouse, ShieldCheck, ArrowUpRight, CheckCircle2, Ship } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/footer/Footer';

const SolutionsPage = () => {
  const solutions = [
    {
      icon: Anchor,
      title: 'For Surveyors',
      description: 'Comprehensive digital tools designed specifically for marine survey professionals.',
      features: [
        'Mobile-first survey tools for field work',
        'Custom report templates and branding',
        'Real-time collaboration with team members',
        'Offline data capture capabilities',
        'Photo and video documentation',
        'Client management system',
        'Automated report generation',
        'Schedule management'
      ]
    },
    {
      icon: Building2,
      title: 'For Marinas',
      description: 'Streamlined solutions for marina operations and vessel management.',
      features: [
        'Fleet management dashboard',
        'Maintenance tracking system',
        'Dock planning and optimization',
        'Billing integration',
        'Customer portal access',
        'Inspection scheduling',
        'Environmental compliance tools',
        'Staff management'
      ]
    },
    {
      icon: Warehouse,
      title: 'For Boat Yards',
      description: 'Integrated tools for efficient boat yard operations and maintenance tracking.',
      features: [
        'Work order management',
        'Progress tracking system',
        'Photo documentation',
        'Customer communication portal',
        'Inventory management',
        'Project timelines',
        'Cost tracking',
        'Quality control tools'
      ]
    },
    {
      icon: ShieldCheck,
      title: 'For Insurers',
      description: 'Comprehensive risk assessment and survey management tools for marine insurers.',
      features: [
        'Standardized survey reports',
        'Risk assessment tools',
        'Claims integration',
        'Analytics dashboard',
        'Document management',
        'Compliance tracking',
        'Automated notifications',
        'Historical data analysis'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
      <Navigation />

      {/* Hero Section */}
      <div className="relative min-h-[500px] bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-dark-900 dark:via-dark-950 dark:to-dark-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 animate-ken-burns"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-blue-600/20 dark:from-blue-500/10 dark:via-transparent dark:to-blue-500/10"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-white dark:via-blue-400 dark:to-white animate-gradient mb-6">
              Solutions for Every Maritime Professional
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Discover how NauticEdge can transform your maritime operations with our comprehensive suite of digital solutions.
            </p>
          </div>
        </div>
      </div>

      {/* Solutions Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-24">
          {solutions.map((solution, index) => (
            <div
              key={index}
              className="group bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-200/50 dark:border-dark-700/50 hover:shadow-xl transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl flex items-center justify-center mr-4">
                  <solution.icon className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{solution.title}</h2>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                {solution.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {solution.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                  </div>
                ))}
              </div>

              <a
                href="/contact"
                className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors group/button"
              >
                Learn More
                <ArrowUpRight className="ml-2 h-5 w-5 transform group-hover/button:translate-x-1 group-hover/button:-translate-y-1 transition-transform" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-blue-900/20 dark:via-dark-800 dark:to-blue-900/20 rounded-2xl p-8 md:p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800/40 rounded-2xl flex items-center justify-center">
              <Ship className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Transform Your Maritime Operations?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of maritime professionals who trust NauticEdge for their digital survey needs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/signup"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors group"
            >
              Get Started
              <ArrowUpRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors group"
            >
              Contact Sales
              <ArrowUpRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SolutionsPage;