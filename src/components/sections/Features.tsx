import React, { useState } from 'react';
import { Smartphone, Shield, Zap, BarChart3, Cloud, Users, Apple, PlayCircle, Bell, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: Smartphone,
    title: 'Mobile Surveys',
    description: 'Conduct surveys on-the-go with our mobile-first platform. Capture photos, videos, and data offline.'
  },
  {
    icon: Shield,
    title: 'Secure Reports',
    description: 'Bank-grade encryption for all your survey data and reports. Compliant with maritime industry standards.'
  },
  {
    icon: Zap,
    title: 'Real-time Updates',
    description: 'Get instant notifications and updates on survey progress. Track changes in real-time.'
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Powerful analytics tools to track trends, generate insights, and make data-driven decisions.'
  },
  {
    icon: Cloud,
    title: 'Cloud Storage',
    description: 'Unlimited cloud storage for all your survey data, photos, and documents. Access anywhere.'
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Seamlessly collaborate with team members, clients, and stakeholders in real-time.'
  }
];

const MobileAppsBanner = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement email subscription
    setSubscribed(true);
    setEmail('');
  };

  return (
    <div className="mt-24 bg-gradient-to-br from-blue-50/50 via-white/50 to-blue-50/50 dark:from-blue-900/20 dark:via-dark-800/50 dark:to-blue-900/20 backdrop-blur-sm rounded-2xl border border-blue-100/50 dark:border-blue-800/50 p-8 md:p-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent dark:from-blue-400/5"></div>
      
      <div className="relative">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-white dark:via-blue-400 dark:to-white mb-4">
              Mobile Apps Coming Soon
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-xl">
              Take your marine surveys on the go with our upcoming iOS and Android apps. 
              Sign up to be notified when we launch!
            </p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-8">
              <button disabled className="flex items-center space-x-2 px-6 py-2 bg-gray-100 dark:bg-dark-700 rounded-lg opacity-75 cursor-not-allowed transition-all group">
                <Apple className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                <div className="text-left">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Download on the</div>
                  <div className="text-sm font-medium text-gray-400 dark:text-gray-500">App Store</div>
                </div>
              </button>
              
              <button disabled className="flex items-center space-x-2 px-6 py-2 bg-gray-100 dark:bg-dark-700 rounded-lg opacity-75 cursor-not-allowed transition-all group">
                <PlayCircle className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                <div className="text-left">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Get it on</div>
                  <div className="text-sm font-medium text-gray-400 dark:text-gray-500">Google Play</div>
                </div>
              </button>
            </div>

            {subscribed ? (
              <div className="inline-flex items-center px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg">
                <Bell className="h-5 w-5 mr-2" />
                <span>We'll notify you when the apps launch!</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex max-w-md mx-auto md:mx-0">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-l-lg bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white dark:hover:bg-dark-800"
                  required
                />
                <button
                  type="submit"
                  className="relative overflow-hidden px-6 py-2.5 rounded-r-lg bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 transition-all duration-300"
                >
                  <span className="relative text-white font-medium">
                    Notify Me
                  </span>
                </button>
              </form>
            )}
          </div>

          <div className="relative w-full md:w-96 h-64 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800/40 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-blue-600/20"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Smartphone className="h-32 w-32 text-blue-600/20 dark:text-blue-500/20" />
            </div>
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-400">
                Coming Soon
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const Features = () => {
  return (
    <section id="features" className="py-24 bg-gradient-to-b from-white via-gray-50 to-white dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] -top-64 -right-64 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute w-[500px] h-[500px] -bottom-64 -left-64 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-white dark:via-blue-400 dark:to-white animate-gradient mb-4">
            Powerful Features for Modern Surveyors
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Everything you need to conduct professional marine surveys efficiently and effectively
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index} 
              className="group bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-gray-200/50 dark:border-dark-700/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up relative overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-500 transform group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile Apps Banner */}
        <MobileAppsBanner />
      </div>
    </section>
  );
};

export default Features;