import React, { useState, useEffect } from 'react';
import { Plus, FileText, Download, Mail, Printer, Search, Filter, Loader, Calendar, DollarSign, Clock, AlertCircle, ArrowUpRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import CreateInvoiceModal from './CreateInvoiceModal';
import { generateInvoicePDF } from '../../utils/pdf';
import { format } from 'date-fns';

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
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<'date' | 'amount' | 'status'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [dateRange, setDateRange] = useState<'all' | 'week' | 'month' | 'year'>('all');

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
      setError('Failed to load invoices');
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
      setError('Failed to download invoice');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleSendEmail = async (invoice: Invoice) => {
    try {
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
      setError('Failed to send invoice');
    }
  };

  const getDateRangeFilter = (date: string) => {
    const now = new Date();
    const invoiceDate = new Date(date);
    
    switch (dateRange) {
      case 'week':
        return Math.abs(now.getTime() - invoiceDate.getTime()) <= 7 * 24 * 60 * 60 * 1000;
      case 'month':
        return now.getMonth() === invoiceDate.getMonth() && now.getFullYear() === invoiceDate.getFullYear();
      case 'year':
        return now.getFullYear() === invoiceDate.getFullYear();
      default:
        return true;
    }
  };

  const filteredInvoices = invoices
    .filter(invoice => {
      const matchesSearch = 
        invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.client_name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
      const matchesDateRange = getDateRangeFilter(invoice.issue_date);
      
      return matchesSearch && matchesStatus && matchesDateRange;
    })
    .sort((a, b) => {
      if (sortField === 'date') {
        return sortDirection === 'asc' 
          ? new Date(a.issue_date).getTime() - new Date(b.issue_date).getTime()
          : new Date(b.issue_date).getTime() - new Date(a.issue_date).getTime();
      }
      if (sortField === 'amount') {
        return sortDirection === 'asc' 
          ? a.amount - b.amount
          : b.amount - a.amount;
      }
      return 0;
    });

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <DollarSign className="h-4 w-4" />;
      case 'sent':
        return <Mail className="h-4 w-4" />;
      case 'overdue':
        return <Clock className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-2" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invoices</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your invoices and billing</p>
        </div>
        <a 
          href="/invoices/new" 
          className="relative inline-flex items-center justify-center px-4 py-2 overflow-hidden text-sm font-medium text-white transition-all duration-300 ease-out rounded-lg group"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 to-blue-400 group-hover:from-blue-400 group-hover:to-blue-600"></span>
          <span className="relative flex items-center">
            <Plus className="h-5 w-5 mr-2 transform group-hover:scale-110 transition-transform" />
            Create Invoice
          </span>
        </a>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search invoices..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>

        {/* Date Range Filter */}
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="all">All Time</option>
            <option value="week">Last 7 Days</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200/50 dark:border-dark-700/50 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block">
              <Loader className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-500" />
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading invoices...</p>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-dark-700 mb-4">
              <FileText className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No invoices found</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first invoice'}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <a
                href="/invoices/new"
                className="mt-4 inline-flex items-center text-sm text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
              >
                <Plus className="h-4 w-4 mr-1" />
                Create Your First Invoice
              </a>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-dark-700">
                <tr className="text-left text-sm font-medium text-gray-600 dark:text-gray-300">
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
                  <tr key={invoice.id} className="group hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
                    <td className="px-6 py-4">
                      <a
                        href={`/invoices/${invoice.id}`}
                        className="flex items-center text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 group/link"
                      >
                        <FileText className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
                        <span>{invoice.invoice_number}</span>
                        <ArrowUpRight className="h-4 w-4 ml-1 opacity-0 group-hover/link:opacity-100 transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-all" />
                      </a>
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{invoice.client_name}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                      ${invoice.amount.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {format(new Date(invoice.issue_date), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {format(new Date(invoice.due_date), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(invoice.status)}`}>
                        {getStatusIcon(invoice.status)}
                        <span className="ml-1 capitalize">{invoice.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
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