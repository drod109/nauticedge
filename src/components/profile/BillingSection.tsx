import React, { useState, useEffect } from 'react';
import CurrentPlan from './billing/CurrentPlan';
import PaymentMethods from './billing/PaymentMethods';
import BillingHistory from './billing/BillingHistory';
import { supabase } from '../../lib/supabase';

interface BillingSectionProps {
  onAddPaymentMethod: () => void;
}

const BillingSection = ({ onAddPaymentMethod }: BillingSectionProps) => {
  const [currentPlan, setCurrentPlan] = useState<string>('basic');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get active subscription
        const { data: subscription, error: subError } = await supabase
          .from('subscriptions')
          .select('plan, status')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .single();

        if (subError) throw subError;
        
        // Set current plan, defaulting to 'basic' if no active subscription found
        setCurrentPlan(subscription?.plan || 'basic');
      } catch (err) {
        console.error('Error fetching subscription:', err);
        setError(err instanceof Error ? err.message : 'Failed to load subscription details');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  const handlePlanChange = async (newPlan: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Update subscription
      const { error: updateError } = await supabase.rpc('update_subscription', {
        p_user_id: user.id,
        p_plan: newPlan
      });

      if (updateError) throw updateError;

      // Update local state
      setCurrentPlan(newPlan);

      // Reload the page to reflect changes across the app
      window.location.reload();
    } catch (err) {
      console.error('Error updating subscription:', err);
      setError(err instanceof Error ? err.message : 'Failed to update subscription');
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="h-8 w-8 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8">
      {error && (
        <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Current Plan */}
      <CurrentPlan currentPlan={currentPlan} onPlanChange={handlePlanChange} />

      {/* Payment Methods */}
      <PaymentMethods onAddPaymentMethod={onAddPaymentMethod} />

      {/* Billing History */}
      <BillingHistory />
    </div>
  );
};

export default BillingSection;