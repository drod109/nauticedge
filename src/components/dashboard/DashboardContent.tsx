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
  Monitor,
  ArrowUpRight,
  BarChart,
  TrendingUp,
  Users as UsersIcon
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import MFANotification from '../auth/MFANotification';
import MFASetup from '../auth/MFASetup';

const quickStats = [
  {
    title: 'Active Surveys',
    value: '18',
    change: '+12.5%',
    trend: 'up',
    icon: ClipboardList,
    color: 'purple'
  },
  {
    title: 'Pending Reviews',
    value: '24',
    change: '-3.4%',
    trend: 'down',
    icon: Clock,
    color: 'blue'
  },
  {
    title: 'Completed',
    value: '156',
    change: '+28.4%',
    trend: 'up',
    icon: CheckCircle2,
    color: 'green'
  },
  {
    title: 'Urgent Reviews',
    value: '5',
    change: '-15.3%',
    trend: 'down',
    icon: AlertCircle,
    color: 'red'
  }
];

const recentSurveys = [
  {
    title: 'Ocean Explorer Annual Survey',
    customer: 'Ocean Marine Ltd',
    date: '3/15/2024',
    status: 'completed',
    description: 'Annual inspection and certification survey',
    priority: 'normal'
  },
  {
    title: 'Sea Spirit Maintenance Report',
    customer: 'Pacific Shipping Co',
    date: '3/14/2024',
    status: 'pending',
    description: 'Routine maintenance inspection',
    priority: 'high'
  },
  {
    title: 'Northern Star Inspection',
    customer: 'Atlantic Vessels',
    date: '3/13/2024',
    status: 'draft',
    description: 'Pre-purchase inspection survey',
    priority: 'medium'
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
    <div className="p-6 space-y-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-dark-900 dark:via-dark-950 dark:to-dark-900 text-gray-900 dark:text-white">
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
          />
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <div 
            key={index}
            className="group bg-white dark:bg-dark-800 p-6 rounded-2xl border border-gray-200/50 dark:border-dark-700/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between relative">
              <div className="space-y-2">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.title}</p>
                <div className="flex items-baseline space-x-2">
                  <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300">{stat.value}</p>
                  <span className={`text-sm ${
                    stat.trend === 'up' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`h-12 w-12 bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100/50 dark:from-${stat.color}-900/20 dark:to-${stat.color}-800/10 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-500 transform group-hover:rotate-12 transition-transform duration-300`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Status */}
      <div className="bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-dark-700/50 shadow-sm hover:shadow-xl transition-all duration-300 animate-fade-in-up overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-dark-700">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 rounded-xl flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-green-600 dark:text-green-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payment Status</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Track your payment activity</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white dark:bg-dark-800 p-6 rounded-xl border border-green-200/50 dark:border-green-800/50 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600 dark:text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Paid</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    ${totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
              
            <div className="bg-white dark:bg-dark-800 p-6 rounded-xl border border-yellow-200/50 dark:border-yellow-800/50 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    ${totalPending.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
              
            <div className="bg-white dark:bg-dark-800 p-6 rounded-xl border border-red-200/50 dark:border-red-800/50 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Overdue</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    ${totalOverdue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {paymentRecords.map((record, index) => (
              <div key={index} className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200/50 dark:border-dark-700/50 p-4 hover:shadow-md transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between sm:justify-start sm:space-x-4">
                      <span className="font-medium text-gray-900 dark:text-white">{record.customer}</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(record.status)}`}>
                        {record.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <a href="/sample-invoice.pdf" className="text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400 flex items-center group">
                        {record.invoice}
                        <ArrowUpRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                      </a>
                      <span>•</span>
                      <span>Due {record.dueDate}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end space-x-4">
                    <span className="text-lg font-medium text-gray-900 dark:text-white">
                      ${record.amount.toLocaleString()}
                    </span>
                    <a 
                      href={`/surveys/${record.surveyId}`}
                      className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 hover:bg-gray-50 dark:hover:bg-dark-700 rounded-lg transition-all duration-300 group"
                    >
                      <FileSearch className="h-5 w-5 transform group-hover:scale-110 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Surveys */}
      <div className="bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-dark-700/50 shadow-sm hover:shadow-xl transition-all duration-300 animate-fade-in-up">
        <div className="p-6 border-b border-gray-200 dark:border-dark-700">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Surveys</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Latest survey activities</p>
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-dark-700">
          {recentSurveys.map((survey, index) => (
            <div key={index} className="p-6 flex items-center hover:bg-gray-50/50 dark:hover:bg-dark-700/50 transition-colors group">
              <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-3 sm:space-y-0">
                <div className="flex-shrink-0 h-10 w-10 bg-gray-100/50 dark:bg-dark-700/50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{survey.title}</p>
                    {survey.priority === 'high' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                        High Priority
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{survey.description}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Created {survey.date}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {survey.customer}
                    </span>
                  </div>
                </div>
              </div>
              <div className="ml-4 flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusStyle(survey.status)}`}>
                  {survey.status}
                </span>
                <div className="flex items-center space-x-2 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                    <Download className="h-5 w-5 transform hover:scale-110 transition-transform" />
                  </button>
                  <button className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                    <Share2 className="h-5 w-5 transform hover:scale-110 transition-transform" />
                  </button>
                  <button className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                    <MoreVertical className="h-5 w-5 transform hover:scale-110 transition-transform" />
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