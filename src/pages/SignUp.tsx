import React from 'react';
import SignUpForm from '../components/auth/SignUpForm';
import { Ship } from 'lucide-react';

const SignUp = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-dark-900 dark:to-dark-950 flex">
      {/* Left Panel - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80"
            alt="Marine survey"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-blue-900/40 backdrop-blur-[2px]"></div>
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="text-white max-w-lg">
              <h2 className="text-3xl font-bold mb-6">Join the Future of Marine Surveys</h2>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <div className="h-2 w-2 bg-white rounded-full mr-3"></div>
                  <span>Digital survey tools for enhanced efficiency</span>
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 bg-white rounded-full mr-3"></div>
                  <span>Real-time collaboration with team members</span>
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 bg-white rounded-full mr-3"></div>
                  <span>Advanced analytics and reporting features</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md">
          <a href="/" className="flex items-center justify-center mb-8 hover:opacity-80 transition-opacity">
            <Ship className="h-10 w-10 text-blue-600 dark:text-blue-500" />
            <span className="ml-2 text-2xl font-bold text-gray-900 dark:text-white">NauticEdge</span>
          </a>
          <SignUpForm />
        </div>
      </div>
    </div>
  );
};

export default SignUp;