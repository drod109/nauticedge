import React, { useState, useEffect } from 'react';
import { Plus, CreditCard } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import AddPaymentMethodModal from './AddPaymentMethodModal';

interface PaymentMethod {
  id: string;
  card_last4: string;
  card_brand: string;
  exp_month: string;
  exp_year: string;
  is_default: boolean;
}

interface PaymentMethodsProps {
  onAddPaymentMethod: () => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ onAddPaymentMethod }) => {
  const [showModal, setShowModal] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPaymentMethods = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error: fetchError } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setPaymentMethods(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load payment methods');
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (methodId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // First, set all payment methods to non-default
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', user.id);

      // Then set the selected method as default
      await supabase
        .from('payment_methods')
        .update({ is_default: true })
        .eq('id', methodId);

      await fetchPaymentMethods();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update default payment method');
    }
  };

  const handleDelete = async (methodId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', methodId);

      if (deleteError) throw deleteError;

      await fetchPaymentMethods();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete payment method');
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Methods</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Manage your payment methods</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center text-sm text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add New Card
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-4 text-gray-600 dark:text-gray-400">Loading...</div>
        ) : paymentMethods.length === 0 ? (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">No payment methods added yet</div>
        ) : (
          paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-gray-100 dark:bg-dark-700 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {method.card_brand.charAt(0).toUpperCase() + method.card_brand.slice(1)} ending in {method.card_last4}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Expires {method.exp_month}/{method.exp_year}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {method.is_default ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">
                    Default
                  </span>
                ) : (
                  <button
                    onClick={() => handleSetDefault(method.id)}
                    className="text-sm text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
                  >
                    Make Default
                  </button>
                )}
                {!method.is_default && (
                  <button
                    onClick={() => handleDelete(method.id)}
                    className="text-sm text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <AddPaymentMethodModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchPaymentMethods();
          }}
        />
      )}
    </div>
  );
};

export default PaymentMethods;