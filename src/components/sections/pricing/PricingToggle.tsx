import React from 'react';

interface PricingToggleProps {
  isAnnual: boolean;
  onToggle: (isAnnual: boolean) => void;
}

const PricingToggle: React.FC<PricingToggleProps> = ({ isAnnual, onToggle }) => {
  return (
    <div className="flex items-center justify-center space-x-3">
      <span className={`text-sm font-medium transition-colors duration-200 ${
        !isAnnual 
          ? 'text-blue-600 dark:text-blue-400' 
          : 'text-gray-500 dark:text-gray-400'
      }`}>
        Monthly
      </span>
      <button
        onClick={() => onToggle(!isAnnual)}
        className="relative h-7 w-14 rounded-full bg-gray-200 dark:bg-dark-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-dark-800"
        role="switch"
        aria-checked={isAnnual}
        aria-label="Toggle billing period"
      >
        <span
          className={`absolute left-0.5 top-0.5 flex h-6 w-6 transform items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-300 ${
            isAnnual ? 'translate-x-7' : ''
          }`}
        >
          <span className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300 opacity-0 group-hover:opacity-10 rounded-full transition-opacity"></span>
        </span>
      </button>
      <div className="flex items-center space-x-1.5">
        <span className={`text-sm font-medium transition-colors duration-200 ${
          isAnnual 
            ? 'text-blue-600 dark:text-blue-400' 
            : 'text-gray-500 dark:text-gray-400'
        }`}>
          Annual
        </span>
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
          Save 20%
        </span>
      </div>
    </div>
  );
};

export default PricingToggle;