import React, { useState } from 'react';
import { X, Shield, Globe, Plug, Ruler, ChevronRight, Key } from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import MeasurementUnitsSection from '../components/settings/MeasurementUnitsSection';
import ActiveSessionsList from '../components/settings/security/ActiveSessionsList';
import LoginHistoryList from '../components/settings/security/LoginHistoryList';
import SecuritySection from '../components/settings/security/SecuritySection';
import APISection from '../components/settings/api/APISection';
import { Theme, getInitialTheme, setTheme } from '../lib/theme';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import SessionsModal from '../components/settings/security/SessionsModal';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('security');
  const [theme, setCurrentTheme] = useState<Theme>(getInitialTheme());
  const [showSessionsModal, setShowSessionsModal] = useState(false);
  const [sessionsModalTab, setSessionsModalTab] = useState<'sessions' | 'history'>('sessions');

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setCurrentTheme(newTheme);
  };

  const renderSecurityContent = () => (
    <SecuritySection />
  );

  const renderIntegrationsContent = () => (
    <div className="p-8">
      <APISection />
    </div>
  );

  const renderLanguagesContent = () => (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Language Settings</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Choose your preferred language for the interface</p>
        <div className="max-w-xs">
          <select className="block w-full px-3 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500">
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Date and Time Format</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Configure how dates and times are displayed</p>
        <div className="space-y-4 max-w-xs">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date Format</label>
            <select className="block w-full px-3 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500">
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time Format</label>
            <select className="block w-full px-3 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500">
              <option value="12">12-hour (AM/PM)</option>
              <option value="24">24-hour</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMeasurementUnitsContent = () => (
    <MeasurementUnitsSection />
  );

  return (
    <ProtectedRoute>
    <div className="flex h-screen bg-gray-50 dark:bg-dark-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header theme={theme} onThemeChange={handleThemeChange} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-full mx-auto w-full py-8 px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-dark-800 rounded-lg shadow border border-gray-200 dark:border-dark-700">
              <div className="px-8 pt-6">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-white dark:via-blue-400 dark:to-white mb-6">Account Settings</h1>
                <div className="flex flex-wrap sm:flex-nowrap gap-4 sm:gap-0 px-0 sm:px-8 -mx-0 sm:-mx-8 pb-4 sm:pb-px border-b border-gray-200 dark:border-dark-700 overflow-x-auto scrollbar-hide">
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`w-full sm:w-auto text-sm font-medium flex items-center space-x-2 px-4 py-2 sm:py-0 sm:px-0 rounded-lg sm:rounded-none sm:pb-4 sm:mr-8 ${
                      activeTab === 'security'
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 sm:bg-transparent sm:border-b-2 sm:border-blue-600'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 sm:hover:bg-transparent sm:dark:hover:bg-transparent'
                    }`}
                  >
                    <Shield className="h-4 w-4" />
                    <span>Security</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('integrations')}
                    className={`w-full sm:w-auto text-sm font-medium flex items-center space-x-2 px-4 py-2 sm:py-0 sm:px-0 rounded-lg sm:rounded-none sm:pb-4 sm:mr-8 ${
                      activeTab === 'integrations'
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 sm:bg-transparent sm:border-b-2 sm:border-blue-600'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 sm:hover:bg-transparent sm:dark:hover:bg-transparent'
                    }`}
                  >
                    <Plug className="h-4 w-4" />
                    <span>Integrations</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('languages')}
                    className={`w-full sm:w-auto text-sm font-medium flex items-center space-x-2 px-4 py-2 sm:py-0 sm:px-0 rounded-lg sm:rounded-none sm:pb-4 sm:mr-8 ${
                      activeTab === 'languages'
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 sm:bg-transparent sm:border-b-2 sm:border-blue-600'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 sm:hover:bg-transparent sm:dark:hover:bg-transparent'
                    }`}
                  >
                    <Globe className="h-4 w-4" />
                    <span>Languages</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('measurement')}
                    className={`w-full sm:w-auto text-sm font-medium flex items-center space-x-2 px-4 py-2 sm:py-0 sm:px-0 rounded-lg sm:rounded-none sm:pb-4 ${
                      activeTab === 'measurement'
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 sm:bg-transparent sm:border-b-2 sm:border-blue-600'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 sm:hover:bg-transparent sm:dark:hover:bg-transparent'
                    }`}
                  >
                    <Ruler className="h-4 w-4" />
                    <span>Measurement Units</span>
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === 'security' && renderSecurityContent()}
              {activeTab === 'integrations' && renderIntegrationsContent()}
              {activeTab === 'languages' && renderLanguagesContent()}
              {activeTab === 'measurement' && renderMeasurementUnitsContent()}
            </div>
          </div>
        </main>
      </div>
      
      {/* Sessions Modal */}
      <SessionsModal
        isOpen={showSessionsModal}
        onClose={() => setShowSessionsModal(false)}
        activeTab={sessionsModalTab}
        onTabChange={setSessionsModalTab}
      />
    </div>
    </ProtectedRoute>
  );
};

export default Settings;