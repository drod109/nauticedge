import React from 'react';
import { Plus, CreditCard } from 'lucide-react';

interface PaymentMethodsProps {
  onAddPaymentMethod: () => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ onAddPaymentMethod }) => {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Payment Methods</h2>
        <button
          onClick={onAddPaymentMethod}
          className="flex items-center text-sm text-blue-600 hover:text-blue-700"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add New Card
        </button>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                Visa ending in 4242
              </p>
              <p className="text-sm text-gray-500">Expires 12/24</p>
            </div>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Default
          </span>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;