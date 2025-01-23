import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Share2, 
  MoreVertical,
  Clock,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  Calendar,
  FileSearch,
  ClipboardList,
  Smartphone,
  Laptop,
  Monitor
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import MFANotification from '../auth/MFANotification';
import MFASetup from '../auth/MFASetup';

const recentSurveys = [
  {
    title: 'Ocean Explorer Annual Survey',
    customer: 'Ocean Marine Ltd',
    date: '3/15/2024',
    status: 'completed'
  },
  {
    title: 'Sea Spirit Maintenance Report',
    customer: 'Pacific Shipping Co',
    date: '3/14/2024',
    status: 'pending'
  },
  {
    title: 'Northern Star Inspection',
    customer: 'Atlantic Vessels',
    date: '3/13/2024',
    status: 'draft'
  }
];


const paymentRecords = [
  {
    customer: 'Ocean Marine Ltd',
    invoice: 'INV-2024-001',
    amount: 2500,
    dueDate: '3/30/2024',
    status: 'paid',
    surveyId: 'SUR-001'
  },
  {
    customer: 'Pacific Shipping Co',
    invoice: 'INV-2024-002',
    amount: 1800,
    dueDate: '3/25/2024',
    status: 'pending',
    surveyId: 'SUR-002'
  },
  {
    customer: 'Atlantic Vessels',
    invoice: 'INV-2024-003',
    amount: 3200,
    dueDate: '3/10/2024',
    status: 'overdue',
    surveyId: 'SUR-003'
  }
];
const getStatusStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'paid':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'draft':
      return 'bg-gray-100 text-gray-700';
    case 'overdue':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const DashboardContent = () => {
  const [showMFANotification, setShowMFANotification] = useState(true);
  const [showMFASetup, setShowMFASetup] = useState(false);

  const handleMFASetup = () => {
    setShowMFANotification(false);
    setShowMFASetup(true);
  };

  const handleMFAComplete = () => {
    setShowMFASetup(false);
    // Update user profile to indicate MFA is enabled
  };

  const totalPaid = paymentRecords.reduce((sum, record) => 
    record.status === 'paid' ? sum + record.amount : sum, 0
  );
  const totalPending = paymentRecords.reduce((sum, record) => 
    record.status === 'pending' ? sum + record.amount : sum, 0
  );
  const totalOverdue = paymentRecords.reduce((sum, record) => 
    record.status === 'overdue' ? sum + record.amount : sum, 0
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-dark-900 text-gray-900 dark:text-white">
      {showMFANotification && (
        <MFANotification
          onSetup={handleMFASetup}
          onDismiss={() => setShowMFANotification(false)}
        />
      )}

      {showMFASetup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <MFASetup
            onComplete={handleMFAComplete}
            onSkip={() => setShowMFASetup(false)}
          onSkip={() => setShowMFASetup(false)}
          />
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in">
        <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Surveys</p>
              <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">18</p>
            </div>
            <div className="h-12 w-12 bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-900/10 rounded-lg flex items-center justify-center transform transition-transform hover:scale-110">
              <ClipboardList className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending Surveys</p>
              <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">24</p>
            </div>
            <div className="h-12 w-12 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-900/10 rounded-lg flex items-center justify-center transform transition-transform hover:scale-110">
              <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Completed This Month</p>
              <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400">156</p>
            </div>
            <div className="h-12 w-12 bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-900/10 rounded-lg flex items-center justify-center transform transition-transform hover:scale-110">
              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Urgent Reviews</p>
              <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-400">5</p>
            </div>
            <div className="h-12 w-12 bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-900/10 rounded-lg flex items-center justify-center transform transition-transform hover:scale-110">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Status */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 mt-6 animate-in" style={{ animationDelay: '0.1s' }}>
        <div className="p-6 border-b border-gray-200 dark:border-dark-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Status</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-4 rounded-lg border border-gray-200 dark:border-dark-700 bg-gradient-to-br from-white to-gray-50 dark:from-dark-800 dark:to-dark-900 hover-card">
              <div className="relative">
                <div className="absolute -top-2 -left-2">
                  <div className="h-8 w-8 bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-900/10 rounded-full flex items-center justify-center transform transition-transform group-hover:scale-110">
                    <DollarSign className="h-5 w-5 text-green-600 dark:text-green-500" />
                  </div>
                </div>
                <div className="pt-6">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Paid</p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg border border-gray-200 dark:border-dark-700 bg-gradient-to-br from-white to-gray-50 dark:from-dark-800 dark:to-dark-900 hover-card">
              <div className="relative">
                <div className="absolute -top-2 -left-2">
                  <div className="h-8 w-8 bg-gradient-to-br from-yellow-100 to-yellow-50 dark:from-yellow-900/30 dark:to-yellow-900/10 rounded-full flex items-center justify-center transform transition-transform group-hover:scale-110">
                    <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                  </div>
                </div>
                <div className="pt-6">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalPending.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg border border-gray-200 dark:border-dark-700 bg-gradient-to-br from-white to-gray-50 dark:from-dark-800 dark:to-dark-900 hover-card">
              <div className="relative">
                <div className="absolute -top-2 -left-2">
                  <div className="h-8 w-8 bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-900/10 rounded-full flex items-center justify-center transform transition-transform group-hover:scale-110">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-500" />
                  </div>
                </div>
                <div className="pt-6">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalOverdue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Overdue</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 dark:text-gray-400">
                  <th className="pb-4">Customer</th>
                  <th className="pb-4">Invoice</th>
                  <th className="pb-4">Amount</th>
                  <th className="pb-4">Due Date</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4 text-center">View Survey</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-dark-700">
                {paymentRecords.map((record, index) => (
                  <tr key={index} className="text-sm text-gray-900 dark:text-white">
                    <td className="py-4 text-gray-900 dark:text-white">{record.customer}</td>
                    <td className="py-4">
                      <a href="/sample-invoice.pdf" className="text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400">
                        {record.invoice}
                      </a>
                    </td>
                    <td className="py-4">${record.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="py-4">{record.dueDate}</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusStyle(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="py-4 text-center">
                      <a 
                        href={`/surveys/${record.surveyId}`}
                        className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors inline-flex justify-center"
                      >
                        <FileSearch className="h-5 w-5" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Surveys */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 mt-6 animate-in" style={{ animationDelay: '0.2s' }}>
        <div className="p-6 border-b border-gray-200 dark:border-dark-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Surveys</h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-dark-700">
          {recentSurveys.map((survey, index) => (
            <div key={index} className="p-4 flex items-center hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
              <div className="flex-1 min-w-0 flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <FileText className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{survey.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Created {survey.date}
                  </p>
                </div>
              </div>
              <div className="ml-4 flex items-center space-x-4">
                <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusStyle(survey.status)}`}>
                  {survey.status}
                </span>
                <div className="flex items-center space-x-2">
                  <button className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                    <Download className="h-5 w-5" />
                  </button>
                  <button className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                    <Share2 className="h-5 w-5" />
                  </button>
                  <button className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;