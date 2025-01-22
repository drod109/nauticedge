import React from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import InvoiceBuilder from '../components/invoice/InvoiceBuilder';
import { Theme, getInitialTheme, setTheme } from '../lib/theme';
import ProtectedRoute from '../components/auth/ProtectedRoute';

const InvoiceBuilderPage = () => {
  const [theme, setCurrentTheme] = React.useState<Theme>(getInitialTheme());

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setCurrentTheme(newTheme);
  };

  const handleSave = async (invoiceData: any) => {
    try {
      // Save invoice and redirect to invoices list
      console.log('Saving invoice:', invoiceData);
      window.location.href = '/invoices';
    } catch (error) {
      console.error('Error saving invoice:', error);
    }
  };

  const handleCancel = () => {
    // Redirect back to invoices list
    window.location.href = '/invoices';
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50 dark:bg-dark-900">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header theme={theme} onThemeChange={handleThemeChange} />
          <main className="flex-1 overflow-y-auto p-6">
            <InvoiceBuilder onSave={handleSave} onCancel={handleCancel} />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default InvoiceBuilderPage;