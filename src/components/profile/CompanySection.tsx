import React from 'react';
import { Building2, Check, Pencil } from 'lucide-react';

interface CompanySectionProps {
  isEditing: boolean;
  editForm: {
    company_name: string;
    company_position: string;
    registration_number: string;
    tax_id: string;
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
    <div className="p-8">
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Company Information</h2>
          <button 
            onClick={onEdit}
            className="flex items-center text-sm text-blue-600 hover:text-blue-700"
          >
            {isEditing ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Save
              </>
            ) : (
              <>
                <Pencil className="h-4 w-4 mr-1" />
                Edit
              </>
            )}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Name</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building2 className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={isEditing ? editForm.company_name : (userData?.company_name || 'Not set')}
                onChange={(e) => onChange('company_name', e.target.value)}
                className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                readOnly={!isEditing}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Position</label>
            <input
              type="text"
              value={isEditing ? editForm.company_position : (userData?.company_position || 'Not set')}
              onChange={(e) => onChange('company_position', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              readOnly={!isEditing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Registration Number</label>
            <input
              type="text"
              value={isEditing ? editForm.registration_number : (userData?.registration_number || 'Not set')}
              onChange={(e) => onChange('registration_number', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              readOnly={!isEditing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tax ID</label>
            <input
              type="text"
              value={isEditing ? editForm.tax_id : (userData?.tax_id || 'Not set')}
              onChange={(e) => onChange('tax_id', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              readOnly={!isEditing}
            />
          </div>
        </div>
        {isEditing && (
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanySection;