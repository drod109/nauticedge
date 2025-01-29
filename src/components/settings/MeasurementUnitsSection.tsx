import React, { useState } from 'react';
import { Ruler, ArrowRight, AlertCircle, Check, Info } from 'lucide-react';

interface UnitPreference {
  id: string;
  label: string;
  options: {
    metric: string;
    imperial: string;
    description: string;
    examples: string[];
  };
  value: 'metric' | 'imperial';
}

const MeasurementUnitsSection = () => {
  const [preferences, setPreferences] = useState<UnitPreference[]>([
    {
      id: 'length',
      label: 'Length',
      options: {
        metric: 'Meters',
        imperial: 'Feet',
        description: 'Used for vessel dimensions, distances, and depths',
        examples: ['Hull length', 'Draft depth', 'Mast height']
      },
      value: 'metric'
    },
    {
      id: 'weight',
      label: 'Weight',
      options: {
        metric: 'Kilograms',
        imperial: 'Pounds',
        description: 'Used for vessel weight, cargo, and equipment',
        examples: ['Displacement', 'Cargo capacity', 'Equipment weight']
      },
      value: 'metric'
    },
    {
      id: 'temperature',
      label: 'Temperature',
      options: {
        metric: 'Celsius',
        imperial: 'Fahrenheit',
        description: 'Used for engine temperatures and weather conditions',
        examples: ['Engine temperature', 'Ambient temperature', 'Water temperature']
      },
      value: 'metric'
    },
    {
      id: 'speed',
      label: 'Speed',
      options: {
        metric: 'Knots',
        imperial: 'MPH',
        description: 'Used for vessel speed and wind measurements',
        examples: ['Cruising speed', 'Wind speed', 'Current speed']
      },
      value: 'metric'
    },
    {
      id: 'volume',
      label: 'Volume',
      options: {
        metric: 'Liters',
        imperial: 'Gallons',
        description: 'Used for fuel capacity and liquid measurements',
        examples: ['Fuel capacity', 'Water capacity', 'Oil capacity']
      },
      value: 'metric'
    },
    {
      id: 'pressure',
      label: 'Pressure',
      options: {
        metric: 'Bar',
        imperial: 'PSI',
        description: 'Used for engine pressure and tire measurements',
        examples: ['Engine oil pressure', 'Tire pressure', 'Hydraulic pressure']
      },
      value: 'metric'
    }
  ]);

  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeInfo, setActiveInfo] = useState<string | null>(null);

  const handleUnitChange = (id: string, value: 'metric' | 'imperial') => {
    setPreferences(prev => 
      prev.map(pref => 
        pref.id === id ? { ...pref, value } : pref
      )
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      setError('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = preferences.some(pref => pref.value !== 'metric');

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 rounded-lg flex items-center justify-center">
              <Ruler className="h-5 w-5 text-purple-600 dark:text-purple-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Measurement Units</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Configure your preferred measurement units</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className={`w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center ${
              hasChanges
                ? 'bg-purple-600 dark:bg-purple-500 text-white hover:bg-purple-700 dark:hover:bg-purple-600'
                : 'bg-gray-100 dark:bg-dark-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            }`}
          >
            {saving ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : showSuccess ? (
              <span className="flex items-center">
                <Check className="h-4 w-4 mr-1" />
                Saved
              </span>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-2" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {preferences.map((pref) => (
          <div
            key={pref.id}
            className="group bg-white dark:bg-dark-800 rounded-xl border border-gray-200/50 dark:border-dark-700/50 p-6 hover:shadow-lg transition-all duration-300 relative"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center">
                  <h3 className="font-medium text-gray-900 dark:text-white">{pref.label}</h3>
                  <button
                    onClick={() => setActiveInfo(activeInfo === pref.id ? null : pref.id)}
                    className="ml-2 p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                  >
                    <Info className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{pref.options.description}</p>
              </div>
              <div className="flex items-center">
                <div className="flex rounded-lg bg-gray-100 dark:bg-dark-700 p-1">
                  <button
                    onClick={() => handleUnitChange(pref.id, 'metric')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      pref.value === 'metric'
                        ? 'bg-white dark:bg-dark-600 text-purple-600 dark:text-purple-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {pref.options.metric}
                  </button>
                  <button
                    onClick={() => handleUnitChange(pref.id, 'imperial')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      pref.value === 'imperial'
                        ? 'bg-white dark:bg-dark-600 text-purple-600 dark:text-purple-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {pref.options.imperial}
                  </button>
                </div>
              </div>
            </div>

            {/* Examples Dropdown */}
            <div className={`overflow-hidden transition-all duration-300 ${
              activeInfo === pref.id ? 'max-h-40' : 'max-h-0'
            }`}>
              <div className="pt-4 border-t border-gray-100 dark:border-dark-700">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Examples:</h4>
                <ul className="space-y-1">
                  {pref.options.examples.map((example, index) => (
                    <li key={index} className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <ArrowRight className="h-3 w-3 mr-2 text-purple-500 dark:text-purple-400" />
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 dark:bg-dark-700 rounded-b-xl overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  pref.value === 'metric'
                    ? 'w-1/2 bg-gradient-to-r from-purple-600 to-purple-400'
                    : 'w-full bg-gradient-to-r from-purple-400 to-purple-600'
                }`}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeasurementUnitsSection;