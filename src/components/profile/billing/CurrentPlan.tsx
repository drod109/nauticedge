import React, { useState } from 'react';
import { Check, Zap, Shield, Users, ChevronRight } from 'lucide-react';
import PlanChangeModal from './PlanChangeModal';
import { supabase } from '../../../lib/supabase';

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
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePlanSelect = (plan: string) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const handlePlanChange = async () => {
    if (!selectedPlan) return;
    
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.rpc('update_subscription', {
        p_user_id: user.id,
        p_plan: selectedPlan
      });

      if (error) throw error;

      onPlanChange(selectedPlan);
      setShowModal(false);
    } catch (error) {
      console.error('Error changing plan:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-12">
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
                      <div className="text-sm">
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
                      className={`text-sm font-medium px-3 py-1 rounded-lg transition-colors ${
                        isUpgrade
                          ? 'bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600'
                          : 'bg-gray-100 dark:bg-dark-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-dark-600'
                      }`}
                    >
                      {isUpgrade ? 'Upgrade' : 'Switch'}
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
      
      {showModal && selectedPlan && (
        <PlanChangeModal
          currentPlan={currentPlan}
          newPlan={selectedPlan}
          price={plans.find(p => p.name.toLowerCase() === selectedPlan)?.price || 0}
          onConfirm={handlePlanChange}
          onCancel={() => setShowModal(false)}
          loading={loading}
        />
      )}
    </div>
  );
};

export default CurrentPlan;