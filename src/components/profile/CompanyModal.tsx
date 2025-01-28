import React from 'react';
import { X, Building2, Check } from 'lucide-react';
import { usePreventScroll } from '../../hooks/usePreventScroll';

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  error?: string | null;
  editForm: {
    company_name: string;
    company_position: string;
    registration_number: string;
    tax_id: string;
    company_address_line1: string;
    company_address_line2: string;
    company_city: string;
    company_state: string;
    company_postal_code: string;
    company_country: string;
  };
  onChange: (field: string, value: string) => void;
  loading?: boolean;
}

const CompanyModal: React.FC<CompanyModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editForm,
  error,
  onChange,
  loading = false
}) => {
  usePreventScroll(isOpen);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-y-auto"
    >
      <div className="min-h-full flex items-center justify-center p-0 sm:p-4">
        <div className="bg-white dark:bg-dark-800 w-full sm:max-w-3xl rounded-none sm:rounded-2xl shadow-2xl flex flex-col max-h-[100dvh] sm:max-h-[90dvh] my-auto animate-fade-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700">
          <div className="flex items-center space-x-2">
            <div className="h-12 w-12 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-white dark:via-blue-400 dark:to-white">Edit Company Information</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Update your company details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 p-6 space-y-8 overflow-y-auto scrollbar-hide">
          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Basic Information */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Basic Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={editForm.company_name}
                  onChange={(e) => onChange('company_name', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-lg bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white dark:hover:bg-dark-800"
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Position
                </label>
                <input
                  type="text"
                  value={editForm.company_position}
                  onChange={(e) => onChange('company_position', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-lg bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white dark:hover:bg-dark-800"
                  placeholder="Enter your position"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Registration Number
                </label>
                <input
                  type="text"
                  value={editForm.registration_number}
                  onChange={(e) => onChange('registration_number', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-lg bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white dark:hover:bg-dark-800"
                  placeholder="Enter registration number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tax ID
                </label>
                <input
                  type="text"
                  value={editForm.tax_id}
                  onChange={(e) => onChange('tax_id', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-lg bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white dark:hover:bg-dark-800"
                  placeholder="Enter tax ID"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Address Information</h4>
            <div className="space-y-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Address Line 1
                </label>
                <input
                  type="text"
                  value={editForm.company_address_line1}
                  onChange={(e) => onChange('company_address_line1', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-lg bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white dark:hover:bg-dark-800"
                  placeholder="Street address, P.O. box, company name"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Address Line 2
                </label>
                <input
                  type="text"
                  value={editForm.company_address_line2}
                  onChange={(e) => onChange('company_address_line2', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-lg bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white dark:hover:bg-dark-800"
                  placeholder="Apartment, suite, unit, building, floor, etc."
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={editForm.company_city}
                    onChange={(e) => onChange('company_city', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-lg bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white dark:hover:bg-dark-800"
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    State / Province
                  </label>
                  <input
                    type="text"
                    value={editForm.company_state}
                    onChange={(e) => onChange('company_state', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-lg bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white dark:hover:bg-dark-800"
                    placeholder="Enter state/province"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={editForm.company_postal_code}
                    onChange={(e) => onChange('company_postal_code', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-lg bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white dark:hover:bg-dark-800"
                    placeholder="Enter postal code"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={editForm.company_country}
                    onChange={(e) => onChange('company_country', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-lg bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white dark:hover:bg-dark-800"
                    placeholder="Enter country"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 z-10 bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm border-t border-gray-200 dark:border-dark-700 p-6 sm:rounded-b-2xl">
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:gap-4">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-dark-600 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-700 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={loading}
              className="relative w-full sm:w-auto group overflow-hidden rounded-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 group-hover:scale-105 transition-transform duration-300"></div>
              <div className="relative w-full px-8 py-3 leading-none flex items-center justify-center space-x-2">
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span className="text-white">Save Changes</span>
                  <Check className="h-5 w-5 text-white transform group-hover:scale-110 transition-transform" />
                </>
              )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default CompanyModal;