import React from 'react';
import { useState } from 'react';
import PlanChangeModal from './PlanChangeModal';
import { supabase } from '../../../lib/supabase';

interface CurrentPlanProps {
  currentPlan: string;
  onPlanChange: (newPlan: string) => void;
}

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
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Plan</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['basic', 'professional', 'enterprise'].map((plan) => (
          <div
            key={plan}
            className={`relative p-6 rounded-xl border ${
              plan === currentPlan
                ? 'bg-gradient-to-br from-blue-50 to-white border-blue-200 shadow-lg'
                : 'bg-white border-gray-200 hover:border-blue-200 hover:shadow-md transition-all'
            }`}
          >
            {plan === currentPlan && (
              <span className="absolute -top-3 -right-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                Current Plan
              </span>
            )}
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2 capitalize">{plan}</h3>
              <p className="text-3xl font-bold text-gray-900">
                ${plan === 'basic' ? '49' : plan === 'professional' ? '99' : '249'}
                <span className="text-base font-normal text-gray-500">/month</span>
              </p>
            </div>
            {plan === currentPlan ? (
              <button
                className="w-full py-2.5 px-4 rounded-lg font-medium bg-gray-100 text-gray-400 cursor-not-allowed"
                disabled
              >
                Current Plan
              </button>
            ) : (
              <button
                onClick={() => handlePlanSelect(plan)}
                className="w-full py-2.5 px-4 rounded-lg font-medium bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors"
              >
                {currentPlan === 'basic' && plan === 'professional' ? 'Upgrade' :
                 currentPlan === 'basic' && plan === 'enterprise' ? 'Upgrade' :
                 currentPlan === 'professional' && plan === 'enterprise' ? 'Upgrade' :
                 'Switch Plan'}
              </button>
            )}
          </div>
        ))}
      </div>
      
      {showModal && selectedPlan && (
        <PlanChangeModal
          currentPlan={currentPlan}
          newPlan={selectedPlan}
          price={selectedPlan === 'basic' ? 49 : selectedPlan === 'professional' ? 99 : 249}
          onConfirm={handlePlanChange}
          onCancel={() => setShowModal(false)}
          loading={loading}
        />
      )}
    </div>
  );
};

export default CurrentPlan;