import React, { useState } from 'react';
import { Building2, Pencil, Check, X } from 'lucide-react';

interface CompanySectionProps {
  isEditing: boolean;
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
  userData: any;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onChange: (field: string, value: string) => void;
}

const CompanySection = ({
  isEditing,
  editForm,
  userData,
  onEdit,
  onCancel,
  onSave,
  onChange
}: CompanySectionProps) => {
  return (
    <div className="p-4 sm:p-8">
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Company Information</h2>
          {!isEditing ? (
            <button 
              onClick={onEdit}
              className="flex items-center text-sm text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
            >
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </button>
          ) : (
            <div className="flex items-center space-x-4">
              <button
                onClick={onCancel}
                className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </button>
              <button
                onClick={onSave}
                className="flex items-center text-sm text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
              >
                <Check className="h-4 w-4 mr-1" />
                Save
              </button>
            </div>
          )}
        </div>
        
        {/* Display Company Information */}
        <div className="space-y-8">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Name</label>
                <div className="relative mt-1">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
                  <input
                    type="text"
                    value={isEditing ? editForm.company_name : (userData?.company_name || 'Not set')}
                    onChange={(e) => isEditing && onChange('company_name', e.target.value)}
                    className={`block w-full pl-10 px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg ${
                      isEditing 
                        ? 'bg-white dark:bg-dark-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                        : 'bg-gray-50 dark:bg-dark-700 cursor-not-allowed'
                    } text-gray-900 dark:text-white transition-colors`}
                    readOnly={!isEditing}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Position</label>
                <div className="relative mt-1">
                  <input
                    type="text"
                    value={isEditing ? editForm.company_position : (userData?.company_position || 'Not set')}
                    onChange={(e) => isEditing && onChange('company_position', e.target.value)}
                    className={`block w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg ${
                      isEditing 
                        ? 'bg-white dark:bg-dark-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                        : 'bg-gray-50 dark:bg-dark-700 cursor-not-allowed'
                    } text-gray-900 dark:text-white transition-colors`}
                    readOnly={!isEditing}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Registration Number</label>
                <div className="relative mt-1">
                  <input
                    type="text"
                    value={isEditing ? editForm.registration_number : (userData?.registration_number || 'Not set')}
                    onChange={(e) => isEditing && onChange('registration_number', e.target.value)}
                    className={`block w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg ${
                      isEditing 
                        ? 'bg-white dark:bg-dark-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                        : 'bg-gray-50 dark:bg-dark-700 cursor-not-allowed'
                    } text-gray-900 dark:text-white transition-colors`}
                    readOnly={!isEditing}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tax ID</label>
                <div className="relative mt-1">
                  <input
                    type="text"
                    value={isEditing ? editForm.tax_id : (userData?.tax_id || 'Not set')}
                    onChange={(e) => isEditing && onChange('tax_id', e.target.value)}
                    className={`block w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg ${
                      isEditing 
                        ? 'bg-white dark:bg-dark-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                        : 'bg-gray-50 dark:bg-dark-700 cursor-not-allowed'
                    } text-gray-900 dark:text-white transition-colors`}
                    readOnly={!isEditing}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Address Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address Line 1</label>
                <div className="relative mt-1">
                  <input
                    type="text"
                    value={isEditing ? editForm.company_address_line1 : (userData?.company_address_line1 || 'Not set')}
                    onChange={(e) => isEditing && onChange('company_address_line1', e.target.value)}
                    className={`block w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg ${
                      isEditing 
                        ? 'bg-white dark:bg-dark-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                        : 'bg-gray-50 dark:bg-dark-700 cursor-not-allowed'
                    } text-gray-900 dark:text-white transition-colors`}
                    readOnly={!isEditing}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address Line 2</label>
                <div className="relative mt-1">
                  <input
                    type="text"
                    value={isEditing ? editForm.company_address_line2 : (userData?.company_address_line2 || 'Not set')}
                    onChange={(e) => isEditing && onChange('company_address_line2', e.target.value)}
                    className={`block w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg ${
                      isEditing 
                        ? 'bg-white dark:bg-dark-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                        : 'bg-gray-50 dark:bg-dark-700 cursor-not-allowed'
                    } text-gray-900 dark:text-white transition-colors`}
                    readOnly={!isEditing}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">City</label>
                  <div className="relative mt-1">
                    <input
                      type="text"
                      value={isEditing ? editForm.company_city : (userData?.company_city || 'Not set')}
                      onChange={(e) => isEditing && onChange('company_city', e.target.value)}
                      className={`block w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg ${
                        isEditing 
                          ? 'bg-white dark:bg-dark-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                          : 'bg-gray-50 dark:bg-dark-700 cursor-not-allowed'
                      } text-gray-900 dark:text-white transition-colors`}
                      readOnly={!isEditing}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">State / Province</label>
                  <div className="relative mt-1">
                    <input
                      type="text"
                      value={isEditing ? editForm.company_state : (userData?.company_state || 'Not set')}
                      onChange={(e) => isEditing && onChange('company_state', e.target.value)}
                      className={`block w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg ${
                        isEditing 
                          ? 'bg-white dark:bg-dark-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                          : 'bg-gray-50 dark:bg-dark-700 cursor-not-allowed'
                      } text-gray-900 dark:text-white transition-colors`}
                      readOnly={!isEditing}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Postal Code</label>
                  <div className="relative mt-1">
                    <input
                      type="text"
                      value={isEditing ? editForm.company_postal_code : (userData?.company_postal_code || 'Not set')}
                      onChange={(e) => isEditing && onChange('company_postal_code', e.target.value)}
                      className={`block w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg ${
                        isEditing 
                          ? 'bg-white dark:bg-dark-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                          : 'bg-gray-50 dark:bg-dark-700 cursor-not-allowed'
                      } text-gray-900 dark:text-white transition-colors`}
                      readOnly={!isEditing}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Country</label>
                  <div className="relative mt-1">
                    <input
                      type="text"
                      value={isEditing ? editForm.company_country : (userData?.company_country || 'Not set')}
                      onChange={(e) => isEditing && onChange('company_country', e.target.value)}
                      className={`block w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg ${
                        isEditing 
                          ? 'bg-white dark:bg-dark-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                          : 'bg-gray-50 dark:bg-dark-700 cursor-not-allowed'
                      } text-gray-900 dark:text-white transition-colors`}
                      readOnly={!isEditing}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySection;