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

  const handleCancel = () => {
    // Redirect back to invoices list
    window.location.href = '/invoices';
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.invoiceTo || !formData.email || !formData.dueDate) {
        throw new Error('Please fill in all required fields');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get company info for PDF generation
      const companyInfo = {
        name: userData?.company_name || '',
        address_line1: userData?.company_address_line1 || '',
        address_line2: userData?.company_address_line2 || '',
        city: userData?.company_city || '',
        state: userData?.company_state || '',
        postal_code: userData?.company_postal_code || '',
        country: userData?.company_country || '',
        tax_id: userData?.tax_id || ''
      };

      // Insert invoice into database
      const { error } = await supabase
        .from('invoices')
        .insert([{
          user_id: user.id,
          invoice_number: formData.invoiceNumber,
          client_name: formData.invoiceTo,
          client_email: formData.email,
          client_phone: formData.phone,
          client_address: formData.address,
          amount: calculateTotal(),
          issue_date: formData.invoiceDate,
          due_date: formData.dueDate,
          items: items,
          company_info: companyInfo,
          logo_url: logo,
          notes: '',
          status: 'draft'
        }]);

      if (error) throw error;

      // Redirect to invoices list after successful save
      window.location.href = '/invoices';

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save invoice';
      console.error('Error creating invoice:', message);
      alert(message);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50 dark:bg-dark-900">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header theme={theme} onThemeChange={handleThemeChange} />
          <main className="flex-1 overflow-y-auto p-6">
            <InvoiceBuilder onCancel={handleCancel} />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default InvoiceBuilderPage;