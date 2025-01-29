import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Upload, 
  Plus, 
  Minus, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  DollarSign,
  Save,
  Printer,
  Download,
  Eye,
  Trash2,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { usePreventScroll } from '../../hooks/usePreventScroll';
import { generateInvoicePDF } from '../../utils/pdf';
import { format } from 'date-fns';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  tax: number;
  amount: number;
}

const InvoiceForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    invoiceNumber: `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    issueDate: format(new Date(), 'yyyy-MM-dd'),
    dueDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    notes: '',
    items: [] as InvoiceItem[],
    currency: 'USD',
    taxRate: 0
  });

  // Load user's company info
  useEffect(() => {
    const loadCompanyInfo = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) {
          // Set company info in state if needed
        }
      } catch (error) {
        console.error('Error loading company info:', error);
      }
    };

    loadCompanyInfo();
  }, []);

  // Auto-save functionality
  useEffect(() => {
    const autoSaveTimer = setTimeout(async () => {
      if (formData.clientName || formData.items.length > 0) {
        setAutoSaving(true);
        try {
          // Save draft invoice
          await handleSave(true);
          setLastSaved(new Date());
        } catch (error) {
          console.error('Auto-save error:', error);
        } finally {
          setAutoSaving(false);
        }
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearTimeout(autoSaveTimer);
  }, [formData]);

  const handleSave = async (isDraft = true) => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Validate required fields
      if (!isDraft) {
        if (!formData.clientName || !formData.clientEmail || formData.items.length === 0) {
          throw new Error('Please fill in all required fields');
        }
      }

      const total = calculateTotal();

      const invoice = {
        user_id: user.id,
        invoice_number: formData.invoiceNumber,
        client_name: formData.clientName,
        client_email: formData.clientEmail,
        client_phone: formData.clientPhone,
        client_address: formData.clientAddress || '',
        amount: total,
        issue_date: formData.issueDate,
        due_date: formData.dueDate,
        items: formData.items,
        notes: formData.notes,
        status: isDraft ? 'draft' : 'sent',
        currency: formData.currency
      };

      const { error: saveError } = await supabase
        .from('invoices')
        .insert([invoice]);

      if (saveError) throw saveError;

      if (!isDraft) {
        // Generate and download PDF
        await generateInvoicePDF(invoice);
        navigate('/invoices');
      }

    } catch (err) {
      console.error('Error saving invoice:', err);
      setError(err instanceof Error ? err.message : 'Failed to save invoice');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: crypto.randomUUID(),
          description: '',
          quantity: 1,
          rate: 0,
          tax: formData.taxRate,
          amount: 0
        }
      ]
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    setFormData(prev => {
      const newItems = [...prev.items];
      const item = { ...newItems[index] };

      if (field === 'quantity' || field === 'rate' || field === 'tax') {
        const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
        item[field] = numValue;
        
        // Recalculate amount
        const subtotal = item.quantity * item.rate;
        item.amount = subtotal + (subtotal * (item.tax / 100));
      } else {
        item[field] = value;
      }

      newItems[index] = item;
      return { ...prev, items: newItems };
    });
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;

    setFormData(prev => {
      const items = [...prev.items];
      const draggedItem = items[draggedIndex];
      items.splice(draggedIndex, 1);
      items.splice(index, 0, draggedItem);
      return { ...prev, items };
    });

    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setIsDragging(false);
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };

  const calculateTotalTax = () => {
    return formData.items.reduce((sum, item) => {
      const subtotal = item.quantity * item.rate;
      return sum + (subtotal * (item.tax / 100));
    }, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTotalTax();
  };

  return (
    <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200/50 dark:border-dark-700/50">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-dark-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/invoices')}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Invoice</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {autoSaving ? 'Saving...' : lastSaved ? `Last saved ${format(lastSaved, 'h:mm a')}` : 'Draft'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
            >
              <Eye className="h-4 w-4 mr-2" />
              {previewMode ? 'Edit' : 'Preview'}
            </button>
            <button
              onClick={() => handleSave(false)}
              disabled={loading}
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-all duration-300 ease-out rounded-lg group overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 to-blue-400 group-hover:from-blue-400 group-hover:to-blue-600"></span>
              <span className="relative flex items-center">
                {loading ? (
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save & Send
                    </>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-2" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Invoice Details */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Invoice Number
              </label>
              <input
                type="text"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                readOnly
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Issue Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <input
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, issueDate: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Due Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Client Details */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Client Name *
              </label>
              <input
                type="text"
                value={formData.clientName}
                onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Client Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Client Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="tel"
                  value={formData.clientPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Client Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <textarea
                  value={formData.clientAddress}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientAddress: e.target.value }))}
                  rows={3}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Items */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Invoice Items</h3>
            <button
              onClick={addItem}
              className="flex items-center text-sm text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Item
            </button>
          </div>

          <div className="space-y-4">
            {/* Header */}
            <div className="hidden sm:grid sm:grid-cols-12 gap-4 text-sm font-medium text-gray-500 dark:text-gray-400 px-4">
              <div className="sm:col-span-4">Description</div>
              <div className="sm:col-span-2 text-center">Quantity</div>
              <div className="sm:col-span-2 text-center">Rate</div>
              <div className="sm:col-span-2 text-center">Tax (%)</div>
              <div className="sm:col-span-2 text-right">Amount</div>
            </div>

            {/* Items */}
            {formData.items.map((item, index) => (
              <div
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`group bg-gray-50 dark:bg-dark-700 rounded-lg p-4 space-y-4 sm:space-y-0 sm:grid sm:grid-cols-12 sm:gap-4 sm:items-center ${
                  isDragging ? 'cursor-move' : ''
                }`}
              >
                <div className="sm:col-span-4">
                  <label className="block sm:hidden text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Item description"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block sm:hidden text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block sm:hidden text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Rate
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                      min="0"
                      step="0.01"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block sm:hidden text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Tax (%)
                  </label>
                  <input
                    type="number"
                    value={item.tax}
                    onChange={(e) => handleItemChange(index, 'tax', e.target.value)}
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center justify-between">
                  <label className="block sm:hidden text-sm font-medium text-gray-500 dark:text-gray-400">
                    Amount
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-900 dark:text-white font-medium">
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
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-8 flex justify-end">
            <div className="w-full sm:w-72 space-y-3">
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

          {/* Notes */}
          <div className="mt-8">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Add any notes or payment instructions..."
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm border-t border-gray-200 dark:border-dark-700 p-6 rounded-b-xl">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            {autoSaving && <div className="h-2 w-2 bg-blue-600 dark:bg-blue-500 rounded-full animate-pulse"></div>}
            {lastSaved && <span>Last saved {format(lastSaved, 'h:mm a')}</span>}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/invoices')}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSave(true)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
              disabled={loading}
            >
              Save Draft
            </button>
            <button
              onClick={() => handleSave(false)}
              disabled={loading}
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-all duration-300 ease-out rounded-lg group overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 to-blue-400 group-hover:from-blue-400 group-hover:to-blue-600"></span>
              <span className="relative flex items-center">
                {loading ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save & Send
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;