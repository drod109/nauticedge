import React, { useState } from 'react';
import { X, Mail, Phone, MapPin, User2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { formatPhoneNumber } from '../../../utils/phone';

interface AddClientModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddClientModal: React.FC<AddClientModalProps> = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Format phone number before submission
    const formattedPhone = formData.phone ? formatPhoneNumber(formData.phone) : '';

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('clients')
        .insert([{
          user_id: user.id,
          ...formData,
          phone: formattedPhone
        }]);

      if (error) throw error;

      onSuccess();
    } catch (error) {
      console.error('Error creating client:', error);
      alert('Failed to create client. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-[#1b2838] rounded-xl shadow-2xl max-w-md w-full my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 bg-blue-900/20 rounded-full flex items-center justify-center">
              <User2 className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">Add New Client</h3>
              <p className="mt-1 text-sm text-gray-400">Enter client details below</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Client Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2.5 bg-[#2a3f5a] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors hover:bg-[#344863]"
                placeholder="Enter client name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#2a3f5a] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors hover:bg-[#344863]"
                  placeholder="client@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    const input = e.target.value.replace(/[^\d\s\-\(\)\+]/g, '');
                    setFormData(prev => ({ ...prev, phone: input }));
                  }}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#2a3f5a] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors hover:bg-[#344863]"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  rows={3}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#2a3f5a] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors hover:bg-[#344863]"
                  placeholder="Enter street address"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-[#2a3f5a] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors hover:bg-[#344863]"
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  State/Province
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-[#2a3f5a] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors hover:bg-[#344863]"
                  placeholder="State/Province"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Country
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                className="w-full px-4 py-2.5 bg-[#2a3f5a] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors hover:bg-[#344863]"
                placeholder="Country"
              />
            </div>
          </div>

          <div className="p-6 border-t border-gray-700 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white bg-[#2a3f5a] rounded-lg hover:bg-[#344863] transition-colors focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-[#1b2838]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#1b2838]"
            >
              {loading ? 'Creating...' : 'Create Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClientModal;