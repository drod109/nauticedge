import React from 'react';
import CurrentPlan from './billing/CurrentPlan';
import PaymentMethods from './billing/PaymentMethods';
import BillingHistory from './billing/BillingHistory';

interface BillingSectionProps {
  currentPlan: string;
  onAddPaymentMethod: () => void;
  onPlanChange: (newPlan: string) => void;
}

const BillingSection = ({ currentPlan, onAddPaymentMethod, onPlanChange }: BillingSectionProps) => {
  return (
    <div className="p-4 sm:p-8">
      {/* Current Plan */}
      <CurrentPlan currentPlan={currentPlan} onPlanChange={onPlanChange} />

      {/* Payment Methods */}
      <PaymentMethods onAddPaymentMethod={onAddPaymentMethod} />

      {/* Billing History */}
      <BillingHistory />
    </div>
  );
};

export default BillingSection;