import React from 'react';
import { Facebook, Instagram, Linkedin, Youtube, Twitter, Ship, ArrowUpRight } from 'lucide-react';
import FooterLinks from './FooterLinks';

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:text-[#1877F2]' },
  { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:text-[#1DA1F2]' },
  { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:text-[#E4405F]' },
  { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:text-[#0A66C2]' },
  { icon: Youtube, href: '#', label: 'YouTube', color: 'hover:text-[#FF0000]' },
  { 
    icon: () => (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
      </svg>
    ),
    href: '#',
    label: 'TikTok',
    color: 'hover:text-[#000000] dark:hover:text-white'
  }
];

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-white to-gray-50 dark:from-dark-900 dark:to-dark-950 border-t border-gray-200/50 dark:border-dark-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-12 animate-fade-in">
          <div className="flex items-center space-x-4">
            <Ship className="h-8 w-8 text-blue-600 dark:text-blue-500" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-white dark:via-blue-400 dark:to-white">NauticEdge</span>
          </div>
          <div className="flex flex-wrap gap-8">
            <a href="/contact" className="group inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
              Contact Sales
              <ArrowUpRight className="ml-1 h-4 w-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </a>
            <a href="/demo" className="group inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
              Request Demo
              <ArrowUpRight className="ml-1 h-4 w-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </a>
          </div>
        </div>
        
        <div className="mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <FooterLinks />
        </div>
        
        <div className="border-t border-gray-200/50 dark:border-dark-700/50 pt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className={`group relative p-2 bg-gray-100 dark:bg-dark-800 rounded-full hover:bg-opacity-80 dark:hover:bg-opacity-80 transition-all duration-300 ${social.color}`}
                aria-label={social.label}
              >
                {typeof social.icon === 'function' ? (
                  <social.icon />
                ) : (
                  <social.icon className="h-5 w-5 text-gray-600 dark:text-gray-400 transition-colors duration-300" />
                )}
                <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-dark-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {social.label}
                </span>
              </a>
              ))}
            </div>
            <div className="flex flex-wrap gap-8 text-sm text-gray-500 dark:text-gray-400">
              <a href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400">Privacy Policy</a>
              <a href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400">Terms of Service</a>
              <a href="/cookies" className="hover:text-blue-600 dark:hover:text-blue-400">Cookie Policy</a>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} NauticEdge. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;