import React, { useState, useEffect } from 'react';
import { Clock, Calendar as CalendarIcon, Mail, User2, Trash2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../../lib/supabase';

interface Appointment {
  id: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  client_email: string;
  description?: string;
}

const UpcomingAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDelete = async (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedAppointment) return;
    
    setDeleteLoading(true);
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', selectedAppointment.id);

      if (error) throw error;

      // Send cancellation email to client
      const emailContent = {
        to: selectedAppointment.client_email,
        subject: 'Appointment Cancellation',
        body: `Your appointment "${selectedAppointment.title}" scheduled for ${format(new Date(selectedAppointment.date), 'MMMM d, yyyy')} at ${selectedAppointment.start_time} has been cancelled.`
      };

      // In production, integrate with your email service here
      console.log('Sending cancellation email:', emailContent);

      // Remove appointment from local state
      setAppointments(prev => prev.filter(apt => apt.id !== selectedAppointment.id));
      setShowDeleteModal(false);
      setSelectedAppointment(null);
    } catch (error) {
      console.error('Error deleting appointment:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .eq('user_id', user.id)
          .gte('date', new Date().toISOString().split('T')[0])
          .order('date', { ascending: true })
          .order('start_time', { ascending: true })
          .limit(5);

        if (error) throw error;
        setAppointments(data || []);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-1/2"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700">
      <div className="p-4 border-b border-gray-200 dark:border-dark-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Upcoming Appointments
        </h2>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-dark-700">
        {appointments.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No upcoming appointments
          </div>
        ) : (
          appointments.map((appointment) => (
            <div key={appointment.id} className="p-4 hover:bg-gray-50 dark:hover:bg-dark-700">
              <div className="flex items-start justify-between group">
                <div className="space-y-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {appointment.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {format(new Date(appointment.date), 'MMM d, yyyy')}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-1" />
                    {appointment.start_time} - {appointment.end_time}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Mail className="h-4 w-4 mr-1" />
                    {appointment.client_email}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(appointment)}
                  className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
              {appointment.description && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {appointment.description}
                </p>
              )}
            </div>
          ))
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Cancel Appointment
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to cancel this appointment? This action cannot be undone.
                  An email notification will be sent to {selectedAppointment.client_email}.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Keep Appointment
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {deleteLoading ? 'Cancelling...' : 'Cancel Appointment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingAppointments;