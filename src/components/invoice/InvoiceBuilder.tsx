import React, { useState } from 'react';
import { Plus, Trash2, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  tax: number;
  amount: number;
}

interface InvoiceBuilderProps {
  onSave: (data: any) => void;
  onCancel: () => void;
}

const InvoiceBuilder: React.FC<InvoiceBuilderProps> = ({ onSave, onCancel }) => {
  const [logo, setLogo] = useState<string | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: '', quantity: 1, rate: 0, tax: 0, amount: 0 }
  ]);
  const [formData, setFormData] = useState({
    invoiceTo: '',
    phone: '',
    email: '',
    address: '',
    invoiceNumber: `INV-${new Date().getTime().toString().slice(-6)}`,
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: ''
  });

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;

      const file = e.target.files[0];
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('invoice-logos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('invoice-logos')
        .getPublicUrl(fileName);

      setLogo(publicUrl);
    } catch (error) {
      console.error('Error uploading logo:', error);
    }
  };

  const calculateAmount = (quantity: number, rate: number, tax: number) => {
    const subtotal = quantity * rate;
    const taxAmount = (subtotal * tax) / 100;
    return subtotal + taxAmount;
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    const item = { ...newItems[index] };

    if (field === 'quantity' || field === 'rate' || field === 'tax') {
      const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
      item[field] = numValue;
      item.amount = calculateAmount(
        field === 'quantity' ? numValue : item.quantity,
        field === 'rate' ? numValue : item.rate,
        field === 'tax' ? numValue : item.tax
      );
    } else {
      item[field] = value;
    }

    newItems[index] = item;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, rate: 0, tax: 0, amount: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };

  const calculateTotalTax = () => {
    return items.reduce((sum, item) => {
      const subtotal = item.quantity * item.rate;
      return sum + ((subtotal * item.tax) / 100);
    }, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTotalTax();
  };

  const handleSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const invoiceData = {
        user_id: user.id,
        logo_url: logo,
        invoice_to: formData.invoiceTo,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        invoice_number: formData.invoiceNumber,
        invoice_date: formData.invoiceDate,
        due_date: formData.dueDate,
        items,
        subtotal: calculateSubtotal(),
        tax_total: calculateTotalTax(),
        total: calculateTotal(),
        status: 'draft'
      };

      onSave(invoiceData);
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-8">
      {/* Header */}
      <div className="flex justify-between mb-8">
        <div className="w-32">
          <label className="block relative w-32 h-32 border-2 border-dashed border-gray-300 dark:border-dark-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400">
            {logo ? (
              <img src={logo} alt="Company Logo" className="w-full h-full object-contain rounded-lg" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                <Upload className="h-8 w-8 mb-2" />
                <span className="text-xs text-center px-2">Upload Logo</span>
                <span className="text-xs text-center px-2">Recommended size 100x100</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoUpload}
            />
          </label>
        </div>
        <div className="text-right">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">INVOICE</h1>
        </div>
      </div>

      {/* Client & Invoice Info */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Invoice To:</h2>
          <div className="space-y-4">
            <input
              type="text"
              value={formData.invoiceTo}
              onChange={(e) => setFormData(prev => ({ ...prev, invoiceTo: e.target.value }))}
              placeholder="Client Name"
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Phone Number"
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Email Address"
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <textarea
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Address"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Invoice No.
              </label>
              <input
                type="text"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Invoice Date
              </label>
              <input
                type="date"
                value={formData.invoiceDate}
                onChange={(e) => setFormData(prev => ({ ...prev, invoiceDate: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <div className="bg-gray-50 dark:bg-dark-700 rounded-t-lg">
          <div className="grid grid-cols-12 gap-4 p-4 font-medium text-gray-700 dark:text-gray-300">
            <div className="col-span-4">ITEM DESCRIPTION</div>
            <div className="col-span-2 text-center">QTY</div>
            <div className="col-span-2 text-center">RATE</div>
            <div className="col-span-2 text-center">TAX (%)</div>
            <div className="col-span-2 text-right">AMOUNT</div>
          </div>
        </div>
        <div className="border border-gray-200 dark:border-dark-700 rounded-b-lg divide-y divide-gray-200 dark:divide-dark-700">
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 p-4 items-center">
              <div className="col-span-4">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  placeholder="Item description"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  value={item.rate}
                  onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  value={item.tax}
                  onChange={(e) => handleItemChange(index, 'tax', e.target.value)}
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                />
              </div>
              <div className="col-span-2 flex items-center justify-between">
                <span className="font-medium text-gray-900 dark:text-white">
                  ${item.amount.toFixed(2)}
                </span>
                <button
                  onClick={() => removeItem(index)}
                  className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-500"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={addItem}
          className="mt-4 flex items-center text-sm text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Item
        </button>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-80 space-y-3">
          <div className="flex justify-between text-gray-700 dark:text-gray-300">
            <span>Subtotal:</span>
            <span>${calculateSubtotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-700 dark:text-gray-300">
            <span>Tax:</span>
            <span>${calculateTotalTax().toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-medium text-gray-900 dark:text-white">
            <span>Total:</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={onCancel}
          className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
        >
          Save Invoice
        </button>
      </div>
    </div>
  );
};

export default InvoiceBuilder;