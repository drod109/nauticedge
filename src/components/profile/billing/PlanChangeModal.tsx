import React, { useState } from 'react';
import { X, AlertCircle, ArrowUpRight, ArrowRight } from 'lucide-react';
import { capitalize } from '../../../utils/string';

interface PlanChangeModalProps {
  currentPlan: string;
  newPlan: string;
  price: number;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const PlanChangeModal: React.FC<PlanChangeModalProps> = ({
  currentPlan,
  newPlan,
  price,
  onConfirm,
  onCancel,
  loading = false
}) => {
  const [error, setError] = useState<string | null>(null);
  const isUpgrade = 
    (currentPlan === 'basic' && ['professional', 'enterprise'].includes(newPlan)) || 
    (currentPlan === 'professional' && newPlan === 'enterprise');

  const handleConfirm = async () => {
    if (loading) return;
    
    try {
      setError(null);
      await onConfirm();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl max-w-md w-full mx-auto animate-fade-in">
        <div className="p-6 border-b border-gray-200 dark:border-dark-700">
          <div className="flex items-center space-x-3 mb-2">
            <div className="h-12 w-12 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
              {isUpgrade ? (
                <ArrowUpRight className="h-6 w-6 text-blue-600 dark:text-blue-500" />
              ) : (
                <ArrowRight className="h-6 w-6 text-blue-600 dark:text-blue-500" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-white dark:via-blue-400 dark:to-white">
                {isUpgrade ? 'Upgrade Your Plan' : 'Change Subscription Plan'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isUpgrade ? 'Get access to more features' : 'Review your plan change'}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="absolute top-6 right-6 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-fade-in">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-2" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            </div>
          )}

          <div className="text-center">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="relative h-20 w-20">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700 rounded-full blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative h-full w-full bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">${price}</span>
                </div>
              </div>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {isUpgrade
                ? `Upgrade to ${capitalize(newPlan)} Plan`
                : `Switch to ${capitalize(newPlan)} Plan`}
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Billed monthly • Cancel anytime
            </p>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:gap-4">
            <button
              onClick={onCancel}
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-dark-600 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-700 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="relative w-full sm:w-auto group overflow-hidden rounded-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 group-hover:scale-105 transition-transform duration-300"></div>
              <div className="relative w-full px-8 py-3 leading-none flex items-center justify-center space-x-2">
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span className="text-white font-medium">
                      {isUpgrade ? 'Upgrade Now' : 'Confirm Change'}
                    </span>
                    <ArrowRight className="h-5 w-5 text-white transform group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanChangeModal;