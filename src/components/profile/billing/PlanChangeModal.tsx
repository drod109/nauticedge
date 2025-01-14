import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {isUpgrade ? 'Upgrade Plan' : 'Change Plan'}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-2" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          <div className="text-center mb-6">
            <p className="text-gray-600">
              {isUpgrade
                ? `You're about to upgrade to the ${capitalize(newPlan)} plan`
                : `You're about to change your plan to ${capitalize(newPlan)} plan`}
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              ${price}/month
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Confirm Change'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanChangeModal;