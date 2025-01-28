import React from 'react';
import { X, Mail, Phone, Globe, User2, BadgeCheck, Check } from 'lucide-react';

interface PersonalInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  error?: string | null;
  editForm: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    location: string;
  };
  onChange: (field: string, value: string) => void;
  onDetectLocation: () => void;
  isLoadingLocation: boolean;
  loading?: boolean;
}

const PersonalInfoModal: React.FC<PersonalInfoModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editForm,
  error,
  onChange,
  onDetectLocation,
  isLoadingLocation,
  loading = false
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white dark:bg-dark-800 w-full h-full sm:h-auto sm:max-w-3xl sm:m-0 sm:rounded-2xl shadow-2xl flex flex-col max-h-[100dvh] sm:max-h-[90dvh] animate-fade-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700">
          <div className="flex items-center space-x-2">
            <div className="h-12 w-12 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <User2 className="h-5 w-5 text-blue-600 dark:text-blue-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-white dark:via-blue-400 dark:to-white">Edit Personal Information</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Update your personal details</p>
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

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                <div className="relative">
                  <BadgeCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    value={editForm.first_name}
                    onChange={(e) => onChange('first_name', e.target.value)}
                    className="pl-10 w-full px-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-lg bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white dark:hover:bg-dark-800"
                    placeholder="Enter your first name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                <div className="relative">
                  <User2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    value={editForm.last_name}
                    onChange={(e) => onChange('last_name', e.target.value)}
                    className="pl-10 w-full px-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-lg bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white dark:hover:bg-dark-800"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="email"
                  value={editForm.email}
                  className="block w-full pl-10 px-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-lg bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white cursor-not-allowed"
                  readOnly
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => onChange('phone', e.target.value)}
                  className="block w-full pl-10 px-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-lg bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white dark:hover:bg-dark-800"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
              <div className="relative flex">
                <div className="relative flex-1">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => onChange('location', e.target.value)}
                    className="block w-full pl-10 px-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-l-lg bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white dark:hover:bg-dark-800"
                    placeholder="Enter your location"
                  />
                </div>
                <button
                  onClick={onDetectLocation}
                  disabled={isLoadingLocation}
                  className="px-4 py-2.5 bg-gray-100/50 dark:bg-dark-700/50 backdrop-blur-sm border border-l-0 border-gray-300 dark:border-dark-600 rounded-r-lg hover:bg-gray-200 dark:hover:bg-dark-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-gray-700 dark:text-gray-300 transition-all duration-300"
                >
                  {isLoadingLocation ? (
                    <div className="h-5 w-5 border-2 border-gray-400 dark:border-gray-500 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin"></div>
                  ) : (
                    'Detect'
                  )}
                </button>
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
                <div className="h-5 w-5 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
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
  );
};

export default PersonalInfoModal;