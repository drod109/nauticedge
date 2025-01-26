import React, { useState, useEffect } from 'react';
import { Plus, FileText, Download, Mail, Printer, Search, Filter, Loader } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import CreateInvoiceModal from './CreateInvoiceModal';
import { generateInvoicePDF } from '../../utils/pdf';

interface Invoice {
  id: string;
  invoice_number: string;
  client_name: string;
  amount: number;
  issue_date: string;
  due_date: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  description: string;
}

const InvoiceList = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (invoice: Invoice) => {
    try {
      setDownloadingId(invoice.id);
      
      // Get full invoice details including items and company info
      const { data: invoiceDetails, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', invoice.id)
        .single();

      if (error) throw error;

      // Get user's company info if not included in invoice
      if (!invoiceDetails.company_info) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', invoiceDetails.user_id)
          .single();

        if (profile) {
          invoiceDetails.company_info = {
            name: profile.company_name || '',
            address_line1: profile.company_address_line1 || '',
            address_line2: profile.company_address_line2 || '',
            city: profile.company_city || '',
            state: profile.company_state || '',
            postal_code: profile.company_postal_code || '',
            country: profile.company_country || '',
            tax_id: profile.tax_id || ''
          };
        }
      }
      // Generate and download PDF
      await generateInvoicePDF(invoiceDetails);
    } catch (error) {
      console.error('Error downloading invoice:', error);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleSendEmail = async (invoice: Invoice) => {
    try {
      // In production, integrate with email service
      console.log('Sending invoice email:', invoice.invoice_number);
      
      // Update invoice status to 'sent'
      const { error } = await supabase
        .from('invoices')
        .update({ status: 'sent' })
        .eq('id', invoice.id);

      if (error) throw error;
      
      // Refresh invoices list
      await fetchInvoices();
    } catch (error) {
      console.error('Error sending invoice:', error);
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
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
    <div className="p-6 bg-gray-50 dark:bg-dark-900">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invoices</h1>
          <button
            onClick={() => window.location.href = '/invoices/new'}
            className="flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Invoice
          </button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search invoices..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 dark:border-blue-500 border-r-transparent dark:border-r-transparent align-[-0.125em]"></div>
            Loading invoices...
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No invoices found
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-dark-700">
                <tr className="text-left text-sm font-medium text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-dark-600">
                  <th className="px-6 py-4 font-medium">Invoice #</th>
                  <th className="px-6 py-4 font-medium">Client</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Issue Date</th>
                  <th className="px-6 py-4 font-medium">Due Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-dark-700">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
                        <span className="text-gray-900 dark:text-white font-medium">{invoice.invoice_number}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{invoice.client_name}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                      ${invoice.amount.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{new Date(invoice.issue_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{new Date(invoice.due_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-3">
                        <button
                          onClick={() => handleDownload(invoice)}
                          className={`p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors ${
                            downloadingId === invoice.id ? 'cursor-not-allowed opacity-50' : ''
                          }`}
                          disabled={downloadingId === invoice.id}
                          title="Download"
                        >
                          {downloadingId === invoice.id ? (
                            <Loader className="h-5 w-5 animate-spin" />
                          ) : (
                            <Download className="h-5 w-5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleSendEmail(invoice)}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          title="Send Email"
                        >
                          <Mail className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDownload(invoice)}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          title="Print"
                        >
                          <Printer className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateInvoiceModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchInvoices();
          }}
        />
      )}
    </div>
  );
};

export default InvoiceList;