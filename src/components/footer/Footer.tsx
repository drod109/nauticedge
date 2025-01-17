import React from 'react';
import { Facebook, Instagram, Linkedin, Youtube, Twitter } from 'lucide-react';
import FooterLinks from './FooterLinks';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-dark-900 border-t border-gray-200 dark:border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <FooterLinks />
        </div>
        
        <div className="border-t border-gray-200 dark:border-dark-700 pt-8">
          <div className="flex justify-center mb-8">
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-500">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-500">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-500">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-500">
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-500">
                <Youtube className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-500" aria-label="TikTok">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} NauticEdge. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;