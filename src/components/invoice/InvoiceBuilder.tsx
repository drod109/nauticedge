import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Upload, Check, Mail, Phone } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { formatPhoneNumber } from '../../utils/phone';

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
  const [userData, setUserData] = useState<any>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: '', quantity: 1, rate: 0, tax: 0, amount: 0, id: '1' }
  ]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        setUserData(profile);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);
  const [formData, setFormData] = useState({
    invoiceTo: '',
    phone: '',
    email: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    invoiceNumber: `INV-${new Date().getTime().toString().slice(-6)}`,
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    notes: ''
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
    setItems([...items, { 
      description: '', 
      quantity: 1, 
      rate: 0, 
      tax: 0, 
      amount: 0,
      id: String(Date.now())
    }]);
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
      // Validate required fields
      if (!formData.invoiceTo || !formData.invoiceTo.trim()) {
        throw new Error('Client name is required');
      }
      if (!formData.email || !formData.email.trim()) {
        throw new Error('Client email is required');
      }
      if (!formData.dueDate) {
        throw new Error('Due date is required');
      }
      if (!items.length) {
        throw new Error('At least one item is required');
      }
      if (items.some(item => !item.description || !item.description.trim())) {
        throw new Error('All items must have a description');
      }
      if (items.length === 0) {
        throw new Error('At least one item is required');
      }
      if (items.some(item => !item.description.trim())) {
        throw new Error('All items must have a description');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get company info for PDF generation
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      const companyInfo = {
        name: profile?.company_name || '',
        address_line1: profile?.company_address_line1 || '',
        address_line2: profile?.company_address_line2 || '',
        city: profile?.company_city || '',
        state: profile?.company_state || '',
        postal_code: profile?.company_postal_code || '',
        country: profile?.company_country || '',
        tax_id: profile?.tax_id || ''
      };
      // Insert invoice into database
      const { error } = await supabase
        .from('invoices')
        .insert([{
          user_id: user.id,
          invoice_number: formData.invoiceNumber,
          client_name: formData.invoiceTo,
          client_email: formData.email,
          client_phone: formData.phone || null,
          client_address: clientAddress,
          amount: calculateTotal(),
          issue_date: formData.invoiceDate,
          due_date: formData.dueDate,
          items: items,
          company_info: companyInfo,
          logo_url: logo || null,
          notes: formData.notes,
          status: 'draft'
        }]);

      if (error) throw error;

      // Redirect to invoices list after successful save
      window.location.href = '/invoices';

    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error instanceof Error ? error : new Error('Failed to save invoice');
    }
  };

  return (
    <div className="bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 dark:border-dark-700/50 p-4 sm:p-8 transition-all duration-300 hover:shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <div className="w-24 sm:w-32">
          <label className="block relative w-32 h-32 border-2 border-dashed border-gray-300 dark:border-dark-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400">
            {logo ? (
              <img src={logo} alt="Company Logo" className="w-full h-full object-contain rounded-lg" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                <Upload className="h-8 w-8 mb-2" />
                <span className="text-xs text-center px-2">Upload</span>
                <span className="text-xs text-center px-2">100x100</span>
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
          <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-white dark:via-blue-400 dark:to-white mb-4">INVOICE</h1>
        </div>
      </div>

      {/* Client & Invoice Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
        <div>
          <h2 className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-blue-600 dark:from-white dark:to-blue-400 mb-4">From:</h2>
          <div className="space-y-4 mb-8">
            <div className="text-gray-600 dark:text-gray-400">
              <p className="font-medium">{userData?.company_name || 'Company Name Not Set'}</p>
              <p>{userData?.company_address_line1 || 'Address Not Set'}</p>
              {userData?.company_address_line2 && <p>{userData?.company_address_line2}</p>}
              <p>
                {userData?.company_city || 'City Not Set'}, {userData?.company_state || 'State Not Set'} {userData?.company_postal_code || 'Postal Code Not Set'}
              </p>
              <p>{userData?.company_country || 'Country Not Set'}</p>
              <p>Tax ID: {userData?.tax_id || 'Not Set'}</p>
            </div>
          </div>
          
          <h2 className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-blue-600 dark:from-white dark:to-blue-400 mb-4">Bill To:</h2>
          <div className="space-y-4">
            <input
              type="text"
              value={formData.invoiceTo}
              onChange={(e) => setFormData(prev => ({ ...prev, invoiceTo: e.target.value }))}
              placeholder="Client Name"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-lg bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white dark:hover:bg-dark-800"
            />
            <input
              type="text"
              value={formData.address_line1}
              onChange={(e) => setFormData(prev => ({ ...prev, address_line1: e.target.value }))}
              placeholder="Address Line 1"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-lg bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white dark:hover:bg-dark-800"
            />
            <input
              type="text"
              value={formData.address_line2}
              onChange={(e) => setFormData(prev => ({ ...prev, address_line2: e.target.value }))}
              placeholder="Address Line 2 (Optional)"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-lg bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white dark:hover:bg-dark-800"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                placeholder="City"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-lg bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white dark:hover:bg-dark-800"
              />
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                placeholder="State / Province"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-lg bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white dark:hover:bg-dark-800"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={formData.postal_code}
                onChange={(e) => setFormData(prev => ({ ...prev, postal_code: e.target.value }))}
                placeholder="Zip / Postal Code"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-lg bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white dark:hover:bg-dark-800 flex-1"
              />
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                placeholder="Country"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-lg bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white dark:hover:bg-dark-800 flex-1"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Email Address"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-lg bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white dark:hover:bg-dark-800"
                />
              </div>
              <div className="relative flex-1">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: formatPhoneNumber(e.target.value) }))}
                  placeholder="Phone Number"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-lg bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white dark:hover:bg-dark-800"
                />
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Invoice No.
              </label>
              <input
                type="text"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-lg bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white dark:hover:bg-dark-800"
              />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Invoice Date
              </label>
              <input
                type="date"
                value={formData.invoiceDate}
                onChange={(e) => setFormData(prev => ({ ...prev, invoiceDate: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-lg bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white dark:hover:bg-dark-800"
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
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Items</h3>
          <button
            onClick={addItem}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Add Item
          </button>
        </div>
        
        {/* Desktop Headers - Hidden on Mobile */}
        <div className="hidden sm:grid grid-cols-12 gap-4 p-4 font-medium text-gray-700 dark:text-gray-300 bg-gray-50/50 dark:bg-dark-700/50 backdrop-blur-sm rounded-t-lg">
          <div className="col-span-5">DESCRIPTION</div>
          <div className="col-span-2 text-center">QUANTITY</div>
          <div className="col-span-2 text-center">RATE</div>
          <div className="col-span-2 text-center">TAX (%)</div>
          <div className="col-span-1"></div>
        </div>

        {/* Items List */}
        <div className="space-y-4 sm:space-y-0 divide-y divide-gray-200 dark:divide-dark-700 sm:divide-y-0">
          {items.map((item, index) => (
            <div key={index} className="bg-white dark:bg-dark-800 p-4 sm:p-6 rounded-lg sm:rounded-none border border-gray-200/50 dark:border-dark-700/50 sm:border-0">
              {/* Mobile Layout */}
              <div className="block sm:hidden space-y-4">
                <div className="relative">
                  <button
                    onClick={() => removeItem(index)}
                    className="absolute -right-2 -top-2 p-1.5 text-red-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors z-10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    placeholder="Item description"
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-lg bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantity</label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      min="1"
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-lg bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rate</label>
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-lg bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center transition-all duration-300"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tax (%)</label>
                    <input
                      type="number"
                      value={item.tax}
                      onChange={(e) => handleItemChange(index, 'tax', e.target.value)}
                      min="0"
                      max="100"
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-lg bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
                    <div className="relative">
                      <div className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-lg bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white text-center">
                        ${item.amount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden sm:grid grid-cols-12 gap-4 items-center">
                <div className="col-span-5">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    placeholder="Item description"
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-lg bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    min="1"
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-lg bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center transition-all duration-300"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-lg bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center transition-all duration-300"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    value={item.tax}
                    onChange={(e) => handleItemChange(index, 'tax', e.target.value)}
                    min="0"
                    max="100"
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-lg bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center transition-all duration-300"
                  />
                </div>
                <div className="col-span-1 flex justify-end">
                  <button
                    onClick={() => removeItem(index)}
                    className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="flex flex-col sm:flex-row sm:justify-end mb-8">
        <div className="w-full sm:w-80 space-y-3 p-4 bg-gray-50/50 dark:bg-dark-700/50 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-dark-700/50">
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
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-4">
        <button
          onClick={onCancel}
          className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-dark-600 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-700 transition-all duration-300"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="relative w-full sm:w-auto group overflow-hidden rounded-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 group-hover:scale-105 transition-transform duration-300"></div>
          <div className="relative px-8 py-3 leading-none flex items-center justify-center space-x-2">
            <span className="text-white font-medium">Save Invoice</span>
            <Check className="h-5 w-5 text-white transform group-hover:scale-110 transition-transform" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default InvoiceBuilder;