import React from 'react';
import { X, Clock, Mail, MapPin, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface Appointment {
  id: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  client_email: string;
  description?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

interface AppointmentDetailsModalProps {
  appointment: Appointment;
  onClose: () => void;
}

const AppointmentDetailsModal: React.FC<AppointmentDetailsModalProps> = ({ appointment, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-xl max-w-md w-full mx-auto">
        <div className="p-6 border-b border-gray-200 dark:border-dark-700">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Appointment Details
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {appointment.title}
            </h4>
            
            <div className="space-y-3 text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-3 text-gray-400 dark:text-gray-500" />
                <span>{format(new Date(appointment.date), 'MMMM d, yyyy')}</span>
              </div>
              
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-3 text-gray-400 dark:text-gray-500" />
                <span>{appointment.start_time} - {appointment.end_time}</span>
              </div>
              
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-gray-400 dark:text-gray-500" />
                <a 
                  href={`mailto:${appointment.client_email}`}
                  className="text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
                >
                  {appointment.client_email}
                </a>
              </div>

              {(appointment.address_line1 || appointment.city) && (
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 mt-0.5 text-gray-400 dark:text-gray-500" />
                  <div>
                    {appointment.address_line1 && <div>{appointment.address_line1}</div>}
                    {appointment.address_line2 && <div>{appointment.address_line2}</div>}
                    <div>
                      {[
                        appointment.city,
                        appointment.state,
                        appointment.postal_code,
                        appointment.country
                      ].filter(Boolean).join(', ')}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {appointment.description && (
              <div className="mt-6">
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </h5>
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                  {appointment.description}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-dark-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailsModal;