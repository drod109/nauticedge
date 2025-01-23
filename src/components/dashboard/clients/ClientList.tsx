import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Mail, Phone, MapPin, Edit, Trash2, AlertCircle, Building2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import AddClientModal from './AddClientModal';

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

const ClientList = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (client: Client) => {
    setSelectedClient(client);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedClient) return;
    
    setDeleteLoading(true);
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', selectedClient.id);

      if (error) throw error;

      setClients(prev => prev.filter(c => c.id !== selectedClient.id));
      setShowDeleteModal(false);
      setSelectedClient(null);
    } catch (error) {
      console.error('Error deleting client:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredClients = clients.filter(client => {
    const searchString = searchTerm.toLowerCase();
    const matchesSearch = 
      client.name.toLowerCase().includes(searchString) ||
      client.email.toLowerCase().includes(searchString) ||
      client.phone.toLowerCase().includes(searchString) ||
      client.city.toLowerCase().includes(searchString);

    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && client.total_surveys > 0;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Clients</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your client relationships</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200 shadow-sm hover:shadow group"
        >
          <Plus className="h-5 w-5 mr-2 transition-transform group-hover:scale-110" />
          Add Client
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search clients..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
          <div className="h-8 w-8 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-dark-700 mb-4">
            <Building2 className="h-8 w-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No clients found</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            Get started by adding your first client. You can manage all your client relationships from here.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Your First Client
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="group bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {client.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Added {new Date(client.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {/* TODO: Add edit functionality */}}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(client)}
                    className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                  <a href={`mailto:${client.email}`} className="truncate hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
                    {client.email}
                  </a>
                </div>
                {client.phone && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                    <a href={`tel:${client.phone}`} className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
                      {client.phone}
                    </a>
                  </div>
                )}
                {(client.city || client.state || client.country) && (
                  <div className="flex items-start text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                    <span className="line-clamp-2">
                      {[client.city, client.state, client.country].filter(Boolean).join(', ')}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-between text-sm border-t border-gray-100 dark:border-dark-700 pt-4">
                <div className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium text-gray-900 dark:text-white">{client.total_surveys}</span> Surveys
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium text-gray-900 dark:text-white">{client.total_invoices}</span> Invoices
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedClient && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-800 rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
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
                onClick={() => setShowDeleteModal(false)}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center justify-center"
              >
                {deleteLoading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete Client'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Client Modal */}
      {showAddModal && (
        <AddClientModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchClients();
          }}
        />
      )}
    </div>
  );
};

export default ClientList;