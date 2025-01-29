import React from 'react';
import { Mail, Phone, MapPin, Edit, Trash2 } from 'lucide-react';

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

interface ClientCardProps {
  client: Client;
  onEdit: (client: Client, e: React.MouseEvent) => void;
  onDelete: (client: Client, e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, onEdit, onDelete, style }) => {
  return (
    <div
      className="group bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
      style={style}
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
            onClick={(e) => onEdit(client, e)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={`Edit ${client.name}`}
            role="button"
            tabIndex={0}
            type="button"
          >
            <Edit className="h-5 w-5 transform group-hover:scale-110 transition-transform" />
          </button>
          <button
            onClick={(e) => onDelete(client, e)}
            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label={`Delete ${client.name}`}
            role="button"
            tabIndex={0}
            type="button"
          >
            <Trash2 className="h-5 w-5 transform group-hover:scale-110 transition-transform" />
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
  );
};

export default ClientCard;