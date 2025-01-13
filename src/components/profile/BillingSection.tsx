import React from 'react';
import { Plus, CreditCard } from 'lucide-react';

interface BillingSectionProps {
  currentPlan: string;
  onAddPaymentMethod: () => void;
}

const BillingSection = ({ currentPlan, onAddPaymentMethod }: BillingSectionProps) => {
  return (
    <div className="p-8">
      {/* Current Plan */}
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
              <button
                className={`w-full py-2.5 px-4 rounded-lg font-medium transition-colors ${
                  plan === currentPlan
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                }`}
                disabled={plan === currentPlan}
              >
                {plan === currentPlan ? 'Current Plan' : 'Upgrade'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
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

      {/* Billing History */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Billing History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500">
                <th className="pb-4">Date</th>
                <th className="pb-4">Description</th>
                <th className="pb-4">Amount</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="text-sm">
                <td className="py-4">Mar 1, 2024</td>
                <td className="py-4">Professional Plan - Monthly</td>
                <td className="py-4">$99.00</td>
                <td className="py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Paid
                  </span>
                </td>
                <td className="py-4">
                  <button className="text-blue-600 hover:text-blue-700">
                    Download
                  </button>
                </td>
              </tr>
              <tr className="text-sm">
                <td className="py-4">Feb 1, 2024</td>
                <td className="py-4">Professional Plan - Monthly</td>
                <td className="py-4">$99.00</td>
                <td className="py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Paid
                  </span>
                </td>
                <td className="py-4">
                  <button className="text-blue-600 hover:text-blue-700">
                    Download
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BillingSection;