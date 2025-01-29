@@ .. @@
   const renderLanguagesContent = () => (
-    <div className="p-8">
-      <div className="mb-8">
-        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Language Settings</h2>
-        <p className="text-gray-600 dark:text-gray-400 mb-4">Choose your preferred language for the interface</p>
-        <div className="max-w-xs">
-          <select className="block w-full px-3 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500">
-            <option value="en">English</option>
-            <option value="es">Español</option>
-            <option value="fr">Français</option>
-            <option value="de">Deutsch</option>
-          </select>
-        </div>
-      </div>
-
-      <div>
-        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Date and Time Format</h2>
-        <p className="text-gray-600 dark:text-gray-400 mb-4">Configure how dates and times are displayed</p>
-        <div className="space-y-4 max-w-xs">
-          <div>
-            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date Format</label>
-            <select className="block w-full px-3 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500">
-              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
-              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
-              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
-            </select>
-          </div>
-          <div>
-            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time Format</label>
-            <select className="block w-full px-3 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500">
-              <option value="12">12-hour (AM/PM)</option>
-              <option value="24">24-hour</option>
-            </select>
-          </div>
-        </div>
-      </div>
-    </div>
+    <LanguagesSection />
   );
@@ .. @@
 import APISection from './api/APISection';
+import LanguagesSection from './LanguagesSection';
 import { Theme, getInitialTheme, setTheme } from '../lib/theme';