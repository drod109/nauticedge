import React from 'react';
import CurrentPlan from './billing/CurrentPlan';
import PaymentMethods from './billing/PaymentMethods';
import BillingHistory from './billing/BillingHistory';

interface BillingSectionProps {
  currentPlan: string;
  onAddPaymentMethod: () => void;
}

const BillingSection = ({ currentPlan, onAddPaymentMethod }: BillingSectionProps) => {
  return (
    <div className="p-8">
      {/* Current Plan */}
      <CurrentPlan currentPlan={currentPlan} />

      {/* Payment Methods */}
      <PaymentMethods onAddPaymentMethod={onAddPaymentMethod} />

      {/* Billing History */}
      <BillingHistory />
    </div>
  );
};

export default BillingSection;