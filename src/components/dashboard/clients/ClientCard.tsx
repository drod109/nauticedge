import React from 'react';
import { Mail, Phone, MapPin, Edit, Trash2, FileText, Receipt } from 'lucide-react';
import { formatPhoneNumber } from '../../../utils/phone';

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
      className="group bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200/50 dark:border-dark-700/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
      style={style}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-100 to-transparent dark:from-blue-900/20 dark:to-transparent rounded-bl-[100px] opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
      
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-white dark:via-blue-400 dark:to-white group-hover:animate-gradient truncate">
            {client.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Added {new Date(client.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => onEdit(client, e)}
            className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-300 group/button"
          >
            <Edit className="h-5 w-5 transform group-hover/button:scale-110 transition-transform" />
          </button>
          <button
            onClick={(e) => onDelete(client, e)}
            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300 group/button"
          >
            <Trash2 className="h-5 w-5 transform group-hover/button:scale-110 transition-transform" />
          </button>
        </div>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <div className="h-8 w-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
            <Mail className="h-4 w-4 text-blue-600 dark:text-blue-500" />
          </div>
          <a href={`mailto:${client.email}`} className="truncate hover:text-blue-600 dark:hover:text-blue-500 transition-colors group-hover:underline">
            {client.email}
          </a>
        </div>
        {client.phone && (
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <div className="h-8 w-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
              <Phone className="h-4 w-4 text-blue-600 dark:text-blue-500" />
            </div>
            <a href={`tel:${client.phone}`} className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors group-hover:underline">
              {client.phone ? formatPhoneNumber(client.phone) : 'Not provided'}
            </a>
          </div>
        )}
        {(client.city || client.state || client.country) && (
          <div className="flex items-start text-gray-600 dark:text-gray-400">
            <div className="h-8 w-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-3 mt-1 group-hover:scale-110 transition-transform">
              <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-500" />
            </div>
            <span className="line-clamp-2">
              {[client.city, client.state, client.country].filter(Boolean).join(', ')}
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-between text-sm border-t border-gray-100/50 dark:border-dark-700/50 pt-4">
        <div className="flex items-center space-x-2">
          <div className="h-6 w-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
            <FileText className="h-3 w-3 text-blue-600 dark:text-blue-500" />
          </div>
          <span className="text-gray-600 dark:text-gray-400">
            <span className="font-medium text-gray-900 dark:text-white">{client.total_surveys}</span> Surveys
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-6 w-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
            <Receipt className="h-3 w-3 text-blue-600 dark:text-blue-500" />
          </div>
          <span className="text-gray-600 dark:text-gray-400">
            <span className="font-medium text-gray-900 dark:text-white">{client.total_invoices}</span> Invoices
          </span>
        </div>
      </div>
    </div>
  );
};

export default ClientCard;