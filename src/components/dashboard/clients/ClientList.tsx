import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, Search, Filter, Mail, Phone, MapPin, Edit, Trash2, AlertCircle, Building2, FileText, Receipt, Download, Check } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { formatPhoneNumber } from '../../../utils/phone';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useDebounce } from '../../../hooks/useDebounce';
import { CSVLink } from 'react-csv';
import ClientCard from './ClientCard';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  created_at: string;
  total_surveys: number;
  total_invoices: number;
}

interface Column {
  id: keyof Client | 'actions';
  label: string;
  sortable?: boolean;
  visible: boolean;
}

const ClientList = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '+1 ',
    address: '',
    city: '',
    state: '',
    country: ''
  });
  const [sortField, setSortField] = useState<keyof Client>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [columns, setColumns] = useState<Column[]>([
    { id: 'name', label: 'Name', sortable: true, visible: true },
    { id: 'email', label: 'Email', sortable: true, visible: true },
    { id: 'phone', label: 'Phone', sortable: false, visible: true },
    { id: 'city', label: 'Location', sortable: true, visible: true },
    { id: 'total_surveys', label: 'Surveys', sortable: true, visible: true },
    { id: 'total_invoices', label: 'Invoices', sortable: true, visible: true },
    { id: 'actions', label: 'Actions', sortable: false, visible: true }
  ]);
  const [isColumnCustomizerOpen, setIsColumnCustomizerOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: clients.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5
  });

  // Fetch clients with pagination and sorting
  const fetchClients = useCallback(async (isInitial = false) => {
    try {
      // Get auth session first
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      
      if (authError) {
        throw new Error('Authentication error. Please try logging in again.');
      }

      if (!session?.user) {
        throw new Error('Not authenticated');
      }

      if (isInitial) {
        setLoading(true);
      } else {
        setIsFetching(true);
      }

      let query = supabase
        .from('clients')
        .select('*')
        .eq('user_id', session.user.id)
        .order(sortField, { ascending: sortDirection === 'asc' })
        .range((page - 1) * perPage, page * perPage - 1);

      if (debouncedSearch) {
        query = query.or(`name.ilike.%${debouncedSearch}%,email.ilike.%${debouncedSearch}%,phone.ilike.%${debouncedSearch}%`);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to fetch clients: ${error.message}`);
      }

      if (isInitial) {
        setClients(data || []);
      } else {
        setClients(prev => [...prev, ...(data || [])]);
      }
      setHasMore((data || []).length === perPage);

    } catch (error) {
      console.error('Error fetching clients:', error);
      if (error instanceof Error) {
        if (error.message.includes('Not authenticated')) {
          // Redirect to login if not authenticated
          window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
          return;
        }
        setError(error.message);
      } else {
        setError('Failed to load clients. Please try again.');
      }
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  }, [page, perPage, sortField, sortDirection, debouncedSearch]);

  // Initial fetch and search effect
  useEffect(() => {
    setPage(1);
    fetchClients(true);
  }, [debouncedSearch, sortField, sortDirection]);

  // Infinite scroll effect
  useEffect(() => {
    if (page > 1) {
      fetchClients();
    }
  }, [page]);

  // Intersection Observer for infinite scroll
  const observerTarget = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isFetching]);

  // Handle client deletion
  const handleDelete = async (client: Client, e: React.MouseEvent) => {
    // Prevent event bubbling
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    // Clear any existing error
    setError(null);
    
    if (!client) return;
    
    setSelectedClient(client);
    setShowDeleteModal(true);
  };

  const handleModalClose = (e: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setShowDeleteModal(false);
    setShowEditModal(false);
    setSelectedClient(null);
    setError(null);
  };

  const confirmDelete = async () => {
    if (!selectedClient) return;
    
    try {
      setError(null);
      setDeleteLoading(true);

      const { data: { session }, error: authError } = await supabase.auth.getSession();
      if (authError) throw new Error('Authentication error');
      if (!session?.user) throw new Error('Not authenticated');

      const { error: deleteError } = await supabase
        .from('clients')
        .delete()
        .eq('id', selectedClient.id)
        .eq('user_id', session.user.id);

      if (deleteError) {
        throw new Error(`Failed to delete client: ${deleteError.message}`);
      }

      setClients(prev => prev.filter(c => c.id !== selectedClient.id));
      setShowDeleteModal(false);
      setSelectedClient(null);
    } catch (error) {
      console.error('Error deleting client:', error);
      if (error instanceof Error) {
        if (error.message.includes('Not authenticated')) {
          window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
          return;
        }
        setError(error.message);
      } else {
        setError('Failed to delete client. Please try again.');
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle edit client
  const handleEdit = (client: Client, e: React.MouseEvent) => {
    // Prevent event bubbling
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    if (!client) return;
    
    // Clear any existing error
    setError(null);
    setSelectedClient(client);
    setEditForm({
      name: client.name,
      email: client.email,
      phone: client.phone || '+1 ',
      address: client.address || '',
      city: client.city || '',
      state: client.state || '',
      country: client.country || ''
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedClient) return;

    try {
      setEditLoading(true);
      setError(null);

      // Validate required fields
      if (!editForm.name.trim() || !editForm.email.trim()) {
        throw new Error('Name and email are required');
      }

      // Validate email format
      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      if (!emailRegex.test(editForm.email.trim())) {
        throw new Error('Please enter a valid email address');
      }

      const { error: updateError } = await supabase
        .from('clients')
        .update({
          name: editForm.name.trim(),
          email: editForm.email.trim(),
          phone: editForm.phone,
          address: editForm.address,
          city: editForm.city,
          state: editForm.state,
          country: editForm.country
        })
        .eq('id', selectedClient.id)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (updateError) throw updateError;

      // Update client in local state
      setClients(prev => prev.map(c => 
        c.id === selectedClient?.id 
          ? { ...c, ...editForm }
          : c
      ));
      
      setShowEditModal(false);
      setSelectedClient(null);
      // Reset form state
      setEditForm({
        name: '',
        email: '',
        phone: '+1 ',
        address: '',
        city: '',
        state: '',
        country: ''
      });
    } catch (err) {
      console.error('Error updating client:', err);
      setError(err instanceof Error ? err.message : 'Failed to update client');
    } finally {
      setEditLoading(false);
    }
  };

  // Handle column sorting
  const handleSort = (field: keyof Client) => {
    if (!columns.find(col => col.id === field)?.sortable) return;

    setSortDirection(current => 
      sortField === field
        ? current === 'asc' ? 'desc' : 'asc'
        : 'asc'
    );
    setSortField(field);
  };

  // Export data
  const getExportData = () => {
    return clients.map(client => ({
      Name: client.name,
      Email: client.email,
      Phone: client.phone,
      Address: client.address,
      City: client.city,
      State: client.state,
      Country: client.country,
      'Total Surveys': client.total_surveys,
      'Total Invoices': client.total_invoices,
      'Created At': new Date(client.created_at).toLocaleDateString()
    }));
  };

  // Filter clients
  const filteredClients = clients.filter(client => {
    if (filterStatus === 'all') return true;
    return filterStatus === 'active' ? client.total_surveys > 0 : client.total_surveys === 0;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-white dark:via-blue-400 dark:to-white animate-gradient">Clients</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your client relationships</p>
        </div>
        <div className="flex items-center space-x-3">
          <CSVLink
            data={getExportData()}
            filename="clients.csv"
            className="relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-gray-700 dark:text-gray-300 transition-all duration-300 ease-out rounded-lg group hover:bg-gray-50 dark:hover:bg-dark-700 border border-gray-300 dark:border-dark-600"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </CSVLink>
          <a
            href="/dashboard/clients/new"
            className="relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-white transition-all duration-300 ease-out rounded-lg group"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 to-blue-400 group-hover:from-blue-400 group-hover:to-blue-600"></span>
            <span className="relative flex items-center">
            <Plus className="h-4 w-4 mr-2 transform group-hover:scale-110 transition-transform" />
            Add Client
            </span>
          </a>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search clients..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            aria-label="Search clients"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            aria-label="Filter clients"
          >
            <option value="all">All Clients</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Client Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 mb-6 transform hover:scale-110 transition-transform duration-300">
            <Building2 className="h-8 w-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-white dark:via-blue-400 dark:to-white mb-3">No clients found</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            {searchTerm || filterStatus !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first client'}
          </p>
          {!searchTerm && filterStatus === 'all' && (
            <a
              href="/dashboard/clients/new"
              className="mt-6 inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors group"
            >
              <Plus className="h-4 w-4 mr-2 transform group-hover:scale-110 transition-transform" />
              Add Your First Client
            </a>
          )}
        </div>
      ) : (
        <div ref={parentRef} className="h-[600px] overflow-auto">
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const client = filteredClients[virtualRow.index];
              return (
                <ClientCard
                  key={client.id}
                  client={client}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: virtualRow.size,
                    transform: `translateY(${virtualRow.start}px)`
                  }}
                />
              );
            })}
          </div>
          {/* Infinite scroll trigger */}
          <div ref={observerTarget} className="h-10" />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedClient && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleModalClose}
          role="dialog"
          aria-labelledby="delete-modal-title"
          aria-modal="true"
        >
          <div
            className="bg-white dark:bg-dark-800 rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-500" />
                </div>
                <div className="ml-3">
                  <h3 id="delete-modal-title" className="text-lg font-medium text-gray-900 dark:text-white">
                    Delete Client
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete {selectedClient.name}? This action cannot be undone.
                    All associated surveys and invoices will be permanently deleted.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-dark-700 px-6 py-4 flex flex-col-reverse sm:flex-row justify-end gap-3">
              <button
                onClick={handleModalClose}
                className="w-full sm:w-auto relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-gray-700 dark:text-gray-300 transition-all duration-300 ease-out rounded-lg group hover:bg-gray-50 dark:hover:bg-dark-700 border border-gray-300 dark:border-dark-600"
                aria-label="Cancel deletion"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-white transition-all duration-300 ease-out rounded-lg group disabled:opacity-50"
                aria-label="Confirm deletion"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-red-600 to-red-400 group-hover:from-red-400 group-hover:to-red-600"></span>
                <span className="relative flex items-center space-x-2">
                  {deleteLoading ? (
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span className="text-white font-medium">Delete Client</span>
                      <Trash2 className="h-4 w-4 text-white transform group-hover:scale-110 transition-transform" />
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedClient && (
        <div
          onClick={handleModalClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-labelledby="edit-modal-title"
          aria-modal="true"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-dark-800 rounded-xl shadow-xl max-w-md w-full mx-4"
          >
            <div className="p-6 border-b border-gray-200 dark:border-dark-700">
              <h3 id="edit-modal-title" className="text-lg font-medium text-gray-900 dark:text-white">
                Edit Client
              </h3>
            </div>
            {error && (
              <div className="mx-6 mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter client name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => {
                    const formattedNumber = formatPhoneNumber(e.target.value);
                    setEditForm(prev => ({ ...prev, phone: formattedNumber }));
                  }}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Address
                </label>
                <textarea
                  value={editForm.address}
                  onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={editForm.city}
                    onChange={(e) => setEditForm(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={editForm.state}
                    onChange={(e) => setEditForm(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={editForm.country}
                    onChange={(e) => setEditForm(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-dark-700 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="w-full sm:w-auto relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-gray-700 dark:text-gray-300 transition-all duration-300 ease-out rounded-lg group hover:bg-gray-50 dark:hover:bg-dark-700 border border-gray-300 dark:border-dark-600"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                disabled={editLoading}
                className="relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-white transition-all duration-300 ease-out rounded-lg group disabled:opacity-50"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 to-blue-400 group-hover:from-blue-400 group-hover:to-blue-600"></span>
                <span className="relative flex items-center space-x-2">
                  {editLoading ? (
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span className="text-white font-medium">Save Changes</span>
                      <Check className="h-4 w-4 text-white transform group-hover:scale-110 transition-transform" />
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientList;