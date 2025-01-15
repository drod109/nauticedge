import React, { useState } from 'react';
import { Shield, Globe, Plug, Ruler, ChevronRight, X, Key } from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import MFAManagement from '../components/auth/MFAManagement';
import APISection from '../components/settings/api/APISection';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('security');
  const [showMFAManagement, setShowMFAManagement] = useState(false);

  const renderSecurityContent = () => (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Two-Factor Authentication</h2>
        <p className="text-gray-600 mb-4">Add an extra layer of security to your account</p>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Two-factor authentication is enabled</p>
            </div>
          </div>
          <button 
            onClick={() => setShowMFAManagement(true)} 
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Manage
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Sessions</h2>
        <p className="text-gray-600 mb-4">Manage your active sessions and devices</p>
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Active Sessions</p>
                <p className="text-sm text-gray-500">View and manage your active login sessions</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Login History</p>
                <p className="text-sm text-gray-500">Review your recent login activity</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Password</h2>
        <p className="text-gray-600 mb-4">Manage your account password</p>
        <button className="text-sm text-blue-600 hover:text-blue-700">Change password</button>
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Language Settings</h2>
        <p className="text-gray-600 mb-4">Choose your preferred language for the interface</p>
        <div className="max-w-xs">
          <select className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Date and Time Format</h2>
        <p className="text-gray-600 mb-4">Configure how dates and times are displayed</p>
        <div className="space-y-4 max-w-xs">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
            <select className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Format</label>
            <select className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Measurement Units</h2>
        <p className="text-gray-600 mb-4">Configure your preferred measurement units</p>
        <div className="space-y-6 max-w-xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Length</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="length"
                  value="metric"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  defaultChecked
                />
                <span className="ml-2 text-gray-700">Metric (meters)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="length"
                  value="imperial"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-gray-700">Imperial (feet)</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="weight"
                  value="metric"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  defaultChecked
                />
                <span className="ml-2 text-gray-700">Metric (kilograms)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="weight"
                  value="imperial"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-gray-700">Imperial (pounds)</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Temperature</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="temperature"
                  value="celsius"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  defaultChecked
                />
                <span className="ml-2 text-gray-700">Celsius</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="temperature"
                  value="fahrenheit"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-gray-700">Fahrenheit</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Speed</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="speed"
                  value="knots"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  defaultChecked
                />
                <span className="ml-2 text-gray-700">Knots</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="speed"
                  value="kph"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-gray-700">Kilometers per hour</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="speed"
                  value="mph"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-gray-700">Miles per hour</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow">
              <div className="px-8 pt-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h1>
                <div className="flex space-x-8 border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`pb-4 text-sm font-medium flex items-center space-x-2 ${
                      activeTab === 'security'
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
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
                        : 'text-gray-500 hover:text-gray-700'
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
                        : 'text-gray-500 hover:text-gray-700'
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
                        : 'text-gray-500 hover:text-gray-700'
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
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Manage Two-Factor Authentication</h3>
                  <button
                    onClick={() => setShowMFAManagement(false)}
                    className="text-gray-400 hover:text-gray-500"
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
  );
};

export default Settings;