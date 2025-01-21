import React, { useState } from 'react';
import { Shield, Globe, Plug, Ruler, ChevronRight, X, Key } from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import MFAManagement from '../components/auth/MFAManagement';
import APISection from '../components/settings/api/APISection';
import { Theme, getInitialTheme, setTheme } from '../lib/theme';
import ProtectedRoute from '../components/auth/ProtectedRoute';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('security');
  const [showMFAManagement, setShowMFAManagement] = useState(false);
  const [theme, setTheme] = useState<Theme>(getInitialTheme());

  const handleThemeChange = (newTheme: Theme) => {
    setCurrentTheme(newTheme);
    setTheme(newTheme);
  };

  const renderSecurityContent = () => (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Two-Factor Authentication</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Add an extra layer of security to your account</p>
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg border border-gray-200 dark:border-dark-600">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-blue-600 dark:text-blue-500" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Two-factor authentication is enabled</p>
            </div>
          </div>
          <button 
            onClick={() => setShowMFAManagement(true)} 
            className="text-sm text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
          >
            Manage
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Login Sessions</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Manage your active sessions and devices</p>
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 dark:border-dark-600 bg-white dark:bg-dark-800 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Active Sessions</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">View and manage your active login sessions</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
          </div>
          <div className="p-4 border border-gray-200 dark:border-dark-600 bg-white dark:bg-dark-800 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Login History</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Review your recent login activity</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Password</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Manage your account password</p>
        <button className="text-sm text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400">Change password</button>
      </div>
    </div>
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
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Measurement Units</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Configure your preferred measurement units</p>
        <div className="space-y-6 max-w-xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Length</label>
            <div className="flex items-center justify-between p-4 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg">
              <div className="flex items-center">
                <span className="text-sm text-gray-900 dark:text-white">Metric (meters)</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="length"
                  className="sr-only peer"
                  defaultChecked
                />
                <div className="relative w-11 h-6 bg-gray-200 dark:bg-dark-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500"></div>
                <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">Imperial (feet)</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Weight</label>
            <div className="flex items-center justify-between p-4 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg">
              <div className="flex items-center">
                <span className="text-sm text-gray-900 dark:text-white">Metric (kilograms)</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="weight"
                  className="sr-only peer"
                  defaultChecked
                />
                <div className="relative w-11 h-6 bg-gray-200 dark:bg-dark-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500"></div>
                <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">Imperial (pounds)</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Temperature</label>
            <div className="flex items-center justify-between p-4 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg">
              <div className="flex items-center">
                <span className="text-sm text-gray-900 dark:text-white">Celsius</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="temperature"
                  className="sr-only peer"
                  defaultChecked
                />
                <div className="relative w-11 h-6 bg-gray-200 dark:bg-dark-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500"></div>
                <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">Fahrenheit</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Speed</label>
            <div className="flex items-center justify-between p-4 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg">
              <div className="flex items-center">
                <span className="text-sm text-gray-900 dark:text-white">Knots</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="speed"
                  className="sr-only peer"
                  defaultChecked
                />
                <div className="relative w-11 h-6 bg-gray-200 dark:bg-dark-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500"></div>
                <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">MPH/KPH</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ProtectedRoute>
    <div className="flex h-screen bg-gray-50 dark:bg-dark-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header theme={theme} onThemeChange={handleThemeChange} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-dark-800 rounded-lg shadow border border-gray-200 dark:border-dark-700">
              <div className="px-8 pt-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Account Settings</h1>
                <div className="flex space-x-8 border-b border-gray-200 dark:border-dark-700">
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`pb-4 text-sm font-medium flex items-center space-x-2 ${
                      activeTab === 'security'
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <Shield className="h-4 w-4" />
                    <span>Security</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('integrations')}
                    className={`pb-4 text-sm font-medium flex items-center space-x-2 ${
                      activeTab === 'integrations'
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <Plug className="h-4 w-4" />
                    <span>Integrations</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('languages')}
                    className={`pb-4 text-sm font-medium flex items-center space-x-2 ${
                      activeTab === 'languages'
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <Globe className="h-4 w-4" />
                    <span>Languages</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('measurement')}
                    className={`pb-4 text-sm font-medium flex items-center space-x-2 ${
                      activeTab === 'measurement'
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
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
          
          {/* MFA Management Modal */}
          {showMFAManagement && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-dark-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Manage Two-Factor Authentication</h3>
                  <button
                    onClick={() => setShowMFAManagement(false)}
                    className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <MFAManagement onClose={() => setShowMFAManagement(false)} />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
    </ProtectedRoute>
  );
};

export default Settings;