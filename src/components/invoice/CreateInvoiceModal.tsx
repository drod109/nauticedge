import React, { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface CreateInvoiceModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: '', quantity: 1, rate: 0, amount: 0 }
  ]);
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    issue_date: new Date().toISOString().split('T')[0],
    due_date: '',
    notes: ''
  });

  const calculateAmount = (quantity: number, rate: number) => {
    return quantity * rate;
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    const item = { ...newItems[index] };

    if (field === 'quantity' || field === 'rate') {
      const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
      item[field] = numValue;
      item.amount = calculateAmount(
        field === 'quantity' ? numValue : item.quantity,
        field === 'rate' ? numValue : item.rate
      );
    } else {
      item[field] = value;
    }

    newItems[index] = item;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, rate: 0, amount: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
    }
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.amount, 0);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Generate invoice number (in production, use a more robust system)
      const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;

      const { error } = await supabase
        .from('invoices')
        .insert([{
          user_id: user.id,
          invoice_number: invoiceNumber,
          client_name: formData.client_name,
          client_email: formData.client_email,
          issue_date: formData.issue_date,
          due_date: formData.due_date,
          amount: calculateTotal(),
          items,
          notes: formData.notes,
          status: 'draft'
        }]);

      if (error) throw error;

      onSuccess();
    } catch (error) {
      console.error('Error creating invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-0 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-dark-800 rounded-none sm:rounded-lg shadow-xl w-full max-w-4xl h-full sm:h-auto sm:max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col h-full">
          <div className="sticky top-0 z-10 bg-white dark:bg-dark-800 p-6 border-b border-gray-200 dark:border-dark-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Create New Invoice</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Client Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Client Name
              </label>
              <input
                type="text"
                value={formData.client_name}
                onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
                className="w-full px-3 py-3 sm:py-2 text-base sm:text-sm border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Client Email
              </label>
              <input
                type="email"
                value={formData.client_email}
                onChange={(e) => setFormData(prev => ({ ...prev, client_email: e.target.value }))}
                className="w-full px-3 py-3 sm:py-2 text-base sm:text-sm border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Issue Date
              </label>
              <input
                type="date"
                value={formData.issue_date}
                onChange={(e) => setFormData(prev => ({ ...prev, issue_date: e.target.value }))}
                className="w-full px-3 py-3 sm:py-2 text-base sm:text-sm border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                className="w-full px-3 py-3 sm:py-2 text-base sm:text-sm border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Invoice Items */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">Items</h4>
              <button
                onClick={addItem}
                className="flex items-center text-sm text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </button>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <div className="hidden sm:grid grid-cols-12 gap-4 text-sm text-gray-500 dark:text-gray-400 px-1">
                <div className="col-span-4">Description</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-2 text-center">Rate</div>
                <div className="col-span-2 text-center">Amount</div>
                <div className="col-span-2"></div>
              </div>
              {items.map((item, index) => (
                <div key={index} className="flex flex-col sm:grid sm:grid-cols-12 gap-3 sm:gap-4 items-start bg-gray-50 dark:bg-dark-700 sm:bg-transparent sm:dark:bg-transparent p-3 sm:p-0 rounded-lg sm:rounded-none">
                  <div className="w-full sm:col-span-4">
                    <label className="block sm:hidden text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Description</label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      placeholder="Item description"
                      className="w-full px-3 py-3 sm:py-2 text-base sm:text-sm border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-none gap-3 sm:gap-0 w-full sm:w-auto sm:col-span-6">
                    <div className="sm:col-span-2">
                      <label className="block sm:hidden text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Quantity</label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      min="1"
                      placeholder="Qty"
                      className="w-full px-3 py-3 sm:py-2 text-base sm:text-sm border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                    />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block sm:hidden text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Rate</label>
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                      min="0"
                      step="0.01"
                      placeholder="Rate"
                      className="w-full px-3 py-3 sm:py-2 text-base sm:text-sm border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                    />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block sm:hidden text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Amount</label>
                    <input
                      type="number"
                      value={item.amount}
                      readOnly
                      className="w-full px-3 py-3 sm:py-2 text-base sm:text-sm border border-gray-300 dark:border-dark-600 rounded-lg bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white cursor-not-allowed text-center"
                    />
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 sm:static sm:col-span-2 flex justify-end">
                    <button
                      onClick={() => removeItem(index)}
                      className="p-1 sm:p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-500"
                    >
                      <Minus className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </div>
                </div>
              ))}
            <div className="mt-4 flex justify-end">
              <div className="w-full sm:w-64 p-2 sm:p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
            </div>
          </div>

          {/* Notes */}
          <div className="mt-4 sm:mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-3 sm:py-2 text-base sm:text-sm border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add any notes or payment instructions..."
            />
          </div>
        </div>

          <div className="sticky bottom-0 z-10 bg-white dark:bg-dark-800 border-t border-gray-200 dark:border-dark-700 p-4">
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:gap-4">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-3 sm:py-2 text-base sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-dark-600 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full sm:w-auto px-4 py-3 sm:py-2 text-base sm:text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Invoice'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoiceModal;