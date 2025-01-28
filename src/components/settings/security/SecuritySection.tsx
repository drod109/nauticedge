import React from 'react';
import { Shield, ArrowRight, History, Laptop, Lock, Key } from 'lucide-react';

const SecuritySection = () => {
  return (
    <div className="p-4 sm:p-8">
      {/* Security Overview Card */}
      <div className="mb-8 bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-blue-900/20 dark:via-dark-800 dark:to-blue-900/20 rounded-2xl p-8 border border-blue-100/50 dark:border-blue-800/50">
        <div className="flex items-center space-x-4 mb-4">
          <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center">
            <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Security Overview</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Manage your account's security settings</p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-200/30 dark:border-dark-700/30">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Security Score</span>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Good</span>
            </div>
            <div className="mt-2 h-2 bg-gray-100 dark:bg-dark-700 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300 rounded-full"></div>
            </div>
          </div>
          <div className="bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-200/30 dark:border-dark-700/30">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Active Sessions</span>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">3 Devices</span>
            </div>
            <div className="mt-2 h-2 bg-gray-100 dark:bg-dark-700 rounded-full overflow-hidden">
              <div className="h-full w-1/2 bg-gradient-to-r from-green-600 to-green-400 dark:from-green-500 dark:to-green-300 rounded-full"></div>
            </div>
          </div>
          <div className="bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-200/30 dark:border-dark-700/30">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Last Password Change</span>
              <span className="text-sm font-medium text-orange-600 dark:text-orange-400">30 days ago</span>
            </div>
            <div className="mt-2 h-2 bg-gray-100 dark:bg-dark-700 rounded-full overflow-hidden">
              <div className="h-full w-1/4 bg-gradient-to-r from-orange-600 to-orange-400 dark:from-orange-500 dark:to-orange-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Two-Factor Authentication */}
        <a
          href="/settings/2fa"
          className="group bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200/50 dark:border-dark-700/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <Key className="h-5 w-5 text-blue-600 dark:text-blue-500" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 dark:text-gray-500 transform group-hover:translate-x-1 transition-transform" />
          </div>
          <div className="h-1.5 w-full bg-gray-100 dark:bg-dark-700 rounded-full overflow-hidden">
            <div className="h-full w-1/2 bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300 rounded-full"></div>
          </div>
        </a>

        {/* Active Sessions */}
        <a
          href="/settings/sessions"
          className="group bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200/50 dark:border-dark-700/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <Laptop className="h-5 w-5 text-green-600 dark:text-green-500" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">Active Sessions</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage your active devices</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 dark:text-gray-500 transform group-hover:translate-x-1 transition-transform" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">
              3 Active Devices
            </span>
          </div>
        </a>

        {/* Login History */}
        <a
          href="/settings/login-history"
          className="group bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200/50 dark:border-dark-700/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <History className="h-5 w-5 text-purple-600 dark:text-purple-500" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Login History</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Review recent login activity</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 dark:text-gray-500 transform group-hover:translate-x-1 transition-transform" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400">
              Last login: 2 hours ago
            </span>
          </div>
        </a>

        {/* Password */}
        <a
          href="/settings/change-password"
          className="group bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200/50 dark:border-dark-700/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-800/10 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <Lock className="h-5 w-5 text-orange-600 dark:text-orange-500" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">Change Password</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Update your password</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 dark:text-gray-500 transform group-hover:translate-x-1 transition-transform" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400">
              Last changed 30 days ago
            </span>
          </div>
        </a>
      </div>
    </div>
  );
};

export default SecuritySection;