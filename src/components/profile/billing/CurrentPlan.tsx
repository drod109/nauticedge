import React, { useState } from 'react';
import { Check, Zap, Shield, Users, ArrowRight, AlertCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useSubscription } from '../../../hooks/useSubscription';
import { usePreventScroll } from '../../../hooks/usePreventScroll';

interface CurrentPlanProps {
  currentPlan: string;
  onPlanChange: (newPlan: string) => void;
}

const plans = [
  {
    name: 'Basic',
    price: 49,
    features: [
      'Up to 20 surveys per month',
      'Basic report templates',
      'Email support',
      '5GB storage',
      'Basic analytics'
    ],
    icon: Zap
  },
  {
    name: 'Professional',
    price: 99,
    features: [
      'Unlimited surveys',
      'Custom report templates',
      'Priority support',
      '50GB storage',
      'Advanced analytics',
      'Team collaboration',
      'API access'
    ],
    icon: Shield,
    popular: true
  },
  {
    name: 'Enterprise',
    price: 249,
    features: [
      'Unlimited everything',
      'White-label reports',
      '24/7 phone support',
      'Unlimited storage',
      'Custom analytics',
      'Advanced team management',
      'Custom API integration',
      'SLA guarantee'
    ],
    icon: Users
  }
];

const CurrentPlan: React.FC<CurrentPlanProps> = ({ currentPlan, onPlanChange }) => {
  const { changePlan, loading, error } = useSubscription();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  usePreventScroll(showConfirmation);

  const handlePlanSelect = async (plan: string) => {
    setSelectedPlan(plan);
    setShowConfirmation(true);
    setAcceptedTerms(false);
  };

  const handleConfirmChange = async () => {
    if (!selectedPlan || !acceptedTerms) return;

    try {
      await changePlan(selectedPlan);
      setShowConfirmation(false);
    } catch (error) {
      console.error('Error changing plan:', error);
    }
  };

  const getSelectedPlanDetails = () => {
    return plans.find(p => p.name.toLowerCase() === selectedPlan);
  };

  return (
    <div className="mb-12">
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Current Plan</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isPlanActive = plan.name.toLowerCase() === currentPlan;
          const isUpgrade = 
            (currentPlan === 'basic' && ['professional', 'enterprise'].includes(plan.name.toLowerCase())) ||
            (currentPlan === 'professional' && plan.name.toLowerCase() === 'enterprise');

          return (
            <div
              key={plan.name}
              className={`relative rounded-xl transition-all duration-300 ${
                isPlanActive
                  ? 'bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-dark-800 border-2 border-blue-500 dark:border-blue-400 shadow-lg'
                  : 'bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-4">
                  <span className="bg-gradient-to-r from-blue-600 to-blue-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                      <plan.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                      <div className="text-sm mb-2">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">${plan.price}</span>
                        <span className="text-gray-500 dark:text-gray-400">/month</span>
                      </div>
                    </div>
                  </div>
                  {isPlanActive ? (
                    <span className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                      <Check className="h-4 w-4 mr-1" />
                      Current
                    </span>
                  ) : (
                    <button
                      onClick={() => handlePlanSelect(plan.name.toLowerCase())} 
                      disabled={loading}
                      className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center ${
                        isUpgrade
                          ? 'bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600'
                          : 'bg-gray-100 dark:bg-dark-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-dark-600'
                      }`}
                    >
                      {loading ? (
                        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          {isUpgrade ? 'Upgrade' : 'Switch'}
                          <ArrowRight className="h-4 w-4 ml-1.5 transform group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {plan.features.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-dark-700 px-2 py-1 rounded-md"
                    >
                      <Check className="h-3 w-3 text-blue-500 dark:text-blue-400 mr-1" />
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Plan Change Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-800 rounded-xl shadow-xl max-w-md w-full mx-auto animate-fade-in">
            <div className="p-6 border-b border-gray-200 dark:border-dark-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Confirm Plan Change
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Please review the changes to your subscription
              </p>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Current vs New Plan Comparison */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Plan</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white capitalize">{currentPlan}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">New Plan</p>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400 capitalize">{selectedPlan}</p>
                </div>
              </div>

              {/* Price Change */}
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">New Monthly Price</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  ${getSelectedPlanDetails()?.price}
                  <span className="text-sm text-gray-500 dark:text-gray-400">/month</span>
                </p>
              </div>

              {/* Terms Acceptance */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="accept-terms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 dark:text-blue-500 focus:ring-blue-500 border-gray-300 dark:border-dark-600 rounded transition-colors"
                />
                <label htmlFor="accept-terms" className="text-sm text-gray-600 dark:text-gray-400">
                  I understand that by confirming this change, my subscription will be updated immediately and I will be billed at the new rate on my next billing cycle.
                </label>
              </div>

              {/* Warning for downgrade if applicable */}
              {currentPlan !== 'basic' && selectedPlan === 'basic' && (
                <div className="flex items-start space-x-2 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">
                    Downgrading to the Basic plan will limit your access to certain features. Any data associated with Professional/Enterprise features will be preserved but inaccessible until you upgrade again.
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-dark-700 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmChange}
                disabled={!acceptedTerms || loading}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Confirm Change'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentPlan;