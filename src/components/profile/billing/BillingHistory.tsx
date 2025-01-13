import React from 'react';

interface BillingHistoryProps {
  transactions?: Array<{
    date: string;
    description: string;
    amount: number;
    status: string;
  }>;
}

const BillingHistory: React.FC<BillingHistoryProps> = ({ 
  transactions = [
    {
      date: 'Mar 1, 2024',
      description: 'Professional Plan - Monthly',
      amount: 99.00,
      status: 'paid'
    },
    {
      date: 'Feb 1, 2024',
      description: 'Professional Plan - Monthly',
      amount: 99.00,
      status: 'paid'
    }
  ] 
}) => {
  return (
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
            {transactions.map((transaction, index) => (
              <tr key={index} className="text-sm">
                <td className="py-4">{transaction.date}</td>
                <td className="py-4">{transaction.description}</td>
                <td className="py-4">${transaction.amount.toFixed(2)}</td>
                <td className="py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {transaction.status}
                  </span>
                </td>
                <td className="py-4">
                  <button className="text-blue-600 hover:text-blue-700">
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BillingHistory;