import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface Transaction {
  id: string;
  transaction_date: string;
  description: string;
  amount: number;
  status: string;
  invoice_number: string;
}

const BillingHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBillingHistory = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error: fetchError } = await supabase
          .from('billing_history')
          .select('*')
          .eq('user_id', user.id)
          .order('transaction_date', { ascending: false });

        if (fetchError) throw fetchError;

        setTransactions(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load billing history');
      } finally {
        setLoading(false);
      }
    };

    fetchBillingHistory();
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownloadInvoice = async (invoiceNumber: string) => {
    // In a production environment, this would generate and download a PDF invoice
    console.log('Downloading invoice:', invoiceNumber);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Billing History</h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No billing history available
          </div>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500">
                <th className="pb-4">Date</th>
                <th className="pb-4">Invoice</th>
                <th className="pb-4">Description</th>
                <th className="pb-4">Amount</th>
                <th className="pb-4">Status</th>
                <th className="pb-4 text-center">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="text-sm">
                  <td className="py-4">
                    {new Date(transaction.transaction_date).toLocaleDateString()}
                  </td>
                  <td className="py-4">{transaction.invoice_number}</td>
                  <td className="py-4">{transaction.description}</td>
                  <td className="py-4">
                    ${transaction.amount.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </td>
                  <td className="py-4">
                    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusStyle(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="py-4 text-center">
                    <button
                      onClick={() => handleDownloadInvoice(transaction.invoice_number)}
                      className="text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default BillingHistory;