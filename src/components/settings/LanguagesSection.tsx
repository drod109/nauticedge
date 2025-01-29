import React, { useState } from 'react';
import { Globe, Check, AlertCircle, ChevronDown, Search } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

interface DateTimeFormat {
  id: string;
  label: string;
  dateFormat: string;
  timeFormat: string;
  example: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' }
];

const dateTimeFormats: DateTimeFormat[] = [
  {
    id: 'us',
    label: 'US Format',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12-hour',
    example: '03/15/2025 02:30 PM'
  },
  {
    id: 'eu',
    label: 'European Format',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24-hour',
    example: '15/03/2025 14:30'
  },
  {
    id: 'iso',
    label: 'ISO Format',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24-hour',
    example: '2025-03-15 14:30'
  }
];

const LanguagesSection = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedFormat, setSelectedFormat] = useState('us');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredLanguages = languages.filter(lang =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      setError('Failed to save language preferences');
    } finally {
      setSaving(false);
    }
  };

  const selectedLanguageData = languages.find(lang => lang.code === selectedLanguage);
  const selectedFormatData = dateTimeFormats.find(format => format.id === selectedFormat);

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-lg flex items-center justify-center">
              <Globe className="h-5 w-5 text-blue-600 dark:text-blue-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Language & Region</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Customize your language and regional preferences</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 transition-all duration-200 flex items-center justify-center"
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Language Selection */}
        <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200/50 dark:border-dark-700/50 p-6 hover:shadow-lg transition-all duration-300">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Display Language</h3>
          <div className="relative">
            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="w-full flex items-center justify-between p-3 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">{selectedLanguageData?.flag}</span>
                <div className="text-left">
                  <div className="font-medium">{selectedLanguageData?.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{selectedLanguageData?.nativeName}</div>
                </div>
              </div>
              <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${showLanguageDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showLanguageDropdown && (
              <div className="absolute z-10 w-full mt-2 bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 shadow-lg">
                <div className="p-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search languages..."
                      className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 dark:border-dark-600 rounded-lg bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {filteredLanguages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => {
                        setSelectedLanguage(language.code);
                        setShowLanguageDropdown(false);
                      }}
                      className="w-full flex items-center px-4 py-2 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                    >
                      <span className="text-2xl mr-3">{language.flag}</span>
                      <div className="text-left flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">{language.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{language.nativeName}</div>
                      </div>
                      {selectedLanguage === language.code && (
                        <Check className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Date & Time Format */}
        <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200/50 dark:border-dark-700/50 p-6 hover:shadow-lg transition-all duration-300">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Date & Time Format</h3>
          <div className="space-y-4">
            {dateTimeFormats.map((format) => (
              <label
                key={format.id}
                className={`flex items-start p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                  selectedFormat === format.id
                    ? 'border-blue-500 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-dark-700 hover:border-blue-300 dark:hover:border-blue-700'
                }`}
              >
                <input
                  type="radio"
                  name="dateFormat"
                  value={format.id}
                  checked={selectedFormat === format.id}
                  onChange={() => setSelectedFormat(format.id)}
                  className="h-4 w-4 mt-1 text-blue-600 dark:text-blue-500 border-gray-300 dark:border-dark-600 focus:ring-blue-500"
                />
                <div className="ml-3">
                  <div className="font-medium text-gray-900 dark:text-white">{format.label}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Date: {format.dateFormat} • Time: {format.timeFormat}
                  </div>
                  <div className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    Example: {format.example}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguagesSection;