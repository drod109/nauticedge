import React, { useState } from 'react';
import { Building2, Pencil } from 'lucide-react';
import CompanyModal from './CompanyModal';

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
  const [showModal, setShowModal] = useState(false);

  const handleSave = () => {
    onSave();
    setShowModal(false);
  };

  return (
    <div className="p-8">
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Company Information</h2>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center text-sm text-blue-600 hover:text-blue-700"
          >
            <Pencil className="h-4 w-4 mr-1" />
            Edit
          </button>
        </div>
        
        {/* Display Company Information */}
        <div className="space-y-8">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={userData?.company_name || 'Not set'}
                    className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    readOnly
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Position</label>
                <input
                  type="text"
                  value={userData?.company_position || 'Not set'}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Registration Number</label>
                <input
                  type="text"
                  value={userData?.registration_number || 'Not set'}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tax ID</label>
                <input
                  type="text"
                  value={userData?.tax_id || 'Not set'}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Address Line 1</label>
                <input
                  type="text"
                  value={userData?.company_address_line1 || 'Not set'}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address Line 2</label>
                <input
                  type="text"
                  value={userData?.company_address_line2 || 'Not set'}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  readOnly
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    value={userData?.company_city || 'Not set'}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">State / Province</label>
                  <input
                    type="text"
                    value={userData?.company_state || 'Not set'}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                  <input
                    type="text"
                    value={userData?.company_postal_code || 'Not set'}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Country</label>
                  <input
                    type="text"
                    value={userData?.company_country || 'Not set'}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        <CompanyModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          editForm={editForm}
          onChange={onChange}
          loading={isEditing}
        />
      </div>
    </div>
  );
};

export default CompanySection;