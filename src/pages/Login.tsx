import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import { Ship, ArrowUpRight, Quote } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase'; 

const Login = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        // Get the redirect path from URL parameters safely
        const params = new URLSearchParams(window.location.search);
        const redirectPath = params.get('redirect') || '/dashboard';

        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          try {
            await supabase.auth.signOut();
            // After signing out, preserve the redirect parameter
            window.location.href = `/login?redirect=${encodeURIComponent(redirectPath)}`;
            return;
          } catch (error: any) {
            // Ignore session_not_found errors
            if (error.message !== 'session_not_found') {
              console.error('Error during sign out:', error);
            }
          }
        }

        // Clear any stored auth data
        const projectId = new URL(import.meta.env.VITE_SUPABASE_URL).hostname.split('.')[0];
        localStorage.removeItem(`sb-${projectId}-auth-token`);

      } catch (error) {
        // Log error but don't throw - we want to show login page regardless
        console.error('Error during initialization:', error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-dark-900 dark:via-dark-950 dark:to-dark-900 flex items-center justify-center relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[800px] h-[800px] -top-96 -left-96 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute w-[800px] h-[800px] -bottom-96 -right-96 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>
        <div className="relative">
          <div className="h-8 w-8 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-dark-900 dark:via-dark-950 dark:to-dark-900 flex relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[800px] h-[800px] -top-96 -left-96 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute w-[800px] h-[800px] -bottom-96 -right-96 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      {/* Left Panel - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 relative z-10">
        <div className="w-full max-w-md">
          <a href="/" className="group flex items-center justify-center mb-8">
            <Ship className="h-10 w-10 text-blue-600 dark:text-blue-500 group-hover:rotate-[-10deg] transition-transform duration-300" />
            <span className="ml-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-white dark:via-blue-400 dark:to-white group-hover:animate-gradient">NauticEdge</span>
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
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-blue-900/40 backdrop-blur-[2px]"></div>
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <blockquote className="text-white max-w-lg animate-fade-in-up">
              <div className="mb-6 relative">
                <Quote className="absolute -top-4 -left-4 h-8 w-8 text-white/20 transform -scale-x-100" />
                <p className="text-2xl font-medium relative z-10">
                "NauticEdge has revolutionized how we conduct marine surveys. The platform's efficiency and reliability are unmatched."
                </p>
              </div>
              <footer className="text-white/90">
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