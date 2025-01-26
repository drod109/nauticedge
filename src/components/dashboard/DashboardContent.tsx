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
            className="group bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 dark:border-dark-700/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
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
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl opacity-0 group-hover:opacity-20 dark:group-hover:opacity-10 blur transition-opacity duration-300"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Status */}
      <div className="bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-dark-700/50 shadow-sm hover:shadow-xl transition-all duration-300 animate-fade-in-up">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { title: 'Paid', amount: totalPaid, icon: DollarSign, color: 'green' },
              { title: 'Pending', amount: totalPending, icon: Clock, color: 'yellow' },
              { title: 'Overdue', amount: totalOverdue, icon: AlertCircle, color: 'red' }
            ].map((item, index) => (
              <div 
                key={index} 
                className={`group p-6 rounded-xl border border-gray-200/50 dark:border-dark-700/50 bg-gradient-to-br from-${item.color}-50/50 to-white dark:from-${item.color}-900/10 dark:to-dark-800/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/50 to-white/0 dark:from-white/0 dark:via-white/5 dark:to-white/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <div className="relative">
                  <div className="h-12 w-12 bg-white/80 dark:bg-dark-800/80 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <item.icon className={`h-6 w-6 text-${item.color}-600 dark:text-${item.color}-500`} />
                  </div>
                  <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">
                    ${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="overflow-x-auto scrollbar-hide rounded-xl border border-gray-200/50 dark:border-dark-700/50">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-dark-700/50">
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Invoice</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Due Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">View Survey</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-dark-700">
                {paymentRecords.map((record, index) => (
                  <tr key={index} className="text-sm text-gray-900 dark:text-white hover:bg-gray-50/50 dark:hover:bg-dark-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="text-gray-900 dark:text-white font-medium">{record.customer}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <a href="/sample-invoice.pdf" className="text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400 flex items-center space-x-1 group">
                        {record.invoice}
                        <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                      </a>
                    </td>
                    <td className="px-6 py-4 font-medium">${record.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{record.dueDate}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <a 
                        href={`/surveys/${record.surveyId}`}
                        className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors inline-flex justify-center group"
                      >
                        <FileSearch className="h-5 w-5 transform group-hover:scale-110 transition-transform" />
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
              <div className="flex-1 min-w-0 flex items-center space-x-3">
                <div className="flex-shrink-0 h-10 w-10 bg-gray-100/50 dark:bg-dark-700/50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
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
              <div className="ml-4 flex items-center space-x-4">
                <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusStyle(survey.status)}`}>
                  {survey.status}
                </span>
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
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