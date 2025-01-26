import React from 'react';
import SignUpForm from '../components/auth/SignUpForm';
import { Ship, ArrowUpRight, Check } from 'lucide-react';

const SignUp = () => {
  const benefits = [
    'Digital survey tools for enhanced efficiency',
    'Real-time collaboration with team members',
    'Advanced analytics and reporting features'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-dark-900 dark:via-dark-950 dark:to-dark-900 flex relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[800px] h-[800px] -top-96 -left-96 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute w-[800px] h-[800px] -bottom-96 -right-96 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      {/* Left Panel - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80"
            alt="Marine survey"
            className="w-full h-full object-cover animate-ken-burns"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-blue-900/40 backdrop-blur-[2px]"></div>
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="text-white max-w-lg animate-fade-in-up">
              <h2 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200 animate-gradient">Join the Future of Marine Surveys</h2>
              <ul className="space-y-6">
                {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="h-8 w-8 bg-white/10 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-lg">{benefit}</span>
                </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 relative z-10">
        <div className="w-full max-w-md">
          <a href="/" className="group flex items-center justify-center mb-8">
            <Ship className="h-10 w-10 text-blue-600 dark:text-blue-500 group-hover:rotate-[-10deg] transition-transform duration-300" />
            <span className="ml-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-white dark:via-blue-400 dark:to-white group-hover:animate-gradient">NauticEdge</span>
          </a>
          <SignUpForm />
        </div>
      </div>
    </div>
  );
};

export default SignUp;