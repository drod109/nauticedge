import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Mail, Phone, Calendar, DollarSign, Download, Printer } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import { Theme, getInitialTheme, setTheme } from '../lib/theme';
import { generateInvoicePDF } from '../utils/pdf';
import ProtectedRoute from '../components/auth/ProtectedRoute';

const InvoiceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [theme, setCurrentTheme] = useState<Theme>(getInitialTheme());
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setCurrentTheme(newTheme);
  };

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        if (!id) return;

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
          .from('invoices')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Invoice not found');

        setInvoice(data);
      } catch (error) {
        console.error('Error fetching invoice:', error);
        setError(error instanceof Error ? error.message : 'Failed to load invoice details');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await generateInvoicePDF(invoice);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      setError('Failed to download invoice');
    } finally {
      setDownloading(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'sent':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50 dark:bg-dark-900">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header theme={theme} onThemeChange={handleThemeChange} />
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <button
                onClick={() => navigate('/invoices')}
                className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mb-6"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Invoices
              </button>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="h-8 w-8 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin"></div>
                </div>
              ) : error ? (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              ) : invoice ? (
                <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700">
                  {/* Header */}
                  <div className="p-6 border-b border-gray-200 dark:border-dark-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl flex items-center justify-center">
                          <FileText className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                        </div>
                        <div>
                          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Invoice {invoice.invoice_number.replace('INV-', '')}
                          </h1>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${getStatusStyle(invoice.status)}`}>
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={handleDownload}
                          disabled={downloading}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700"
                        >
                          {downloading ? (
                            <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Download className="h-5 w-5" />
                          )}
                        </button>
                        <button
                          onClick={handleDownload}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700"
                        >
                          <Printer className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-8">
                    {/* Company Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">From:</h3>
                        <div className="space-y-2">
                          {invoice.company_info ? (
                            <>
                              <p className="font-medium text-gray-900 dark:text-white">{invoice.company_info.name}</p>
                              <p className="text-gray-600 dark:text-gray-400">{invoice.company_info.address_line1}</p>
                              {invoice.company_info.address_line2 && (
                                <p className="text-gray-600 dark:text-gray-400">{invoice.company_info.address_line2}</p>
                              )}
                              <p className="text-gray-600 dark:text-gray-400">
                                {[
                                  invoice.company_info.city,
                                  invoice.company_info.state,
                                  invoice.company_info.postal_code
                                ].filter(Boolean).join(', ')}
                              </p>
                              <p className="text-gray-600 dark:text-gray-400">{invoice.company_info.country}</p>
                              <p className="text-gray-600 dark:text-gray-400">Tax ID: {invoice.company_info.tax_id}</p>
                            </>
                          ) : (
                            <p className="text-gray-500 dark:text-gray-400">Company information not available</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Bill To:</h3>
                        <div className="space-y-2">
                          <p className="font-medium text-gray-900 dark:text-white">{invoice.client_name}</p>
                          {invoice.client_address && (
                            <p className="text-gray-600 dark:text-gray-400">{invoice.client_address}</p>
                          )}
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <Mail className="h-4 w-4 mr-2" />
                            <a href={`mailto:${invoice.client_email}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                              {invoice.client_email}
                            </a>
                          </div>
                          {invoice.client_phone && (
                            <div className="flex items-center text-gray-600 dark:text-gray-400">
                              <Phone className="h-4 w-4 mr-2" />
                              <a href={`tel:${invoice.client_phone}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                                {invoice.client_phone}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Logo and Invoice Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          {invoice.logo_url ? (
                            <img 
                              src={invoice.logo_url} 
                              alt="Company Logo" 
                              className="h-24 w-24 object-contain rounded-lg"
                            />
                          ) : (
                            <div className="h-24 w-24 bg-gray-100 dark:bg-dark-700 rounded-lg flex items-center justify-center">
                              <FileText className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Invoice Details</h3>
                          <div className="space-y-2 text-gray-600 dark:text-gray-400">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              <span>Issue Date: {format(new Date(invoice.issue_date), 'MMM d, yyyy')}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              <span>Due Date: {format(new Date(invoice.due_date), 'MMM d, yyyy')}</span>
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-2" />
                              <span>Amount: ${invoice.amount.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Items Table */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Items</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="text-left text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-dark-700">
                                <th className="pb-3">Description</th>
                                <th className="pb-3 text-right">Quantity</th>
                                <th className="pb-3 text-right">Rate</th>
                                <th className="pb-3 text-right">Amount</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-dark-700">
                              {invoice.items.map((item: any, index: number) => (
                                <tr key={index}>
                                  <td className="py-4 text-gray-900 dark:text-white">{item.description}</td>
                                  <td className="py-4 text-right text-gray-600 dark:text-gray-400">{item.quantity}</td>
                                  <td className="py-4 text-right text-gray-600 dark:text-gray-400">${item.rate.toFixed(2)}</td>
                                  <td className="py-4 text-right text-gray-900 dark:text-white">${item.amount.toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr>
                                <td colSpan={3} className="pt-6 text-right font-medium text-gray-900 dark:text-white">Total:</td>
                                <td className="pt-6 text-right font-medium text-gray-900 dark:text-white">
                                  ${invoice.amount.toFixed(2)}
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>

                      {/* Notes */}
                      {invoice.notes && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Notes</h3>
                          <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{invoice.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">Invoice not found</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default InvoiceDetails;