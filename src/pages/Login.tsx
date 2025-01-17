import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import { Ship } from 'lucide-react';

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-dark-900 dark:to-dark-950 flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md">
          <a href="/" className="flex items-center justify-center mb-8 hover:opacity-80 transition-opacity">
            <Ship className="h-10 w-10 text-blue-600 dark:text-blue-500" />
            <span className="ml-2 text-2xl font-bold text-gray-900 dark:text-white">NauticEdge</span>
          </a>
          <LoginForm />
        </div>
      </div>

      {/* Right Panel - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80"
            alt="Ocean view"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-blue-900/40 backdrop-blur-[2px]"></div>
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <blockquote className="text-white max-w-lg">
              <p className="text-2xl font-medium mb-6">
                "NauticEdge has revolutionized how we conduct marine surveys. The platform's efficiency and reliability are unmatched."
              </p>
              <footer className="text-white/80">
                <p className="font-semibold">James Wilson</p>
                <p>Senior Marine Surveyor, Maritime Inspections Ltd</p>
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;