import React, { useState, useEffect } from 'react';
import { Clock, Calendar as CalendarIcon, Mail, MapPin, Trash2, AlertCircle, ArrowUpRight } from 'lucide-react';
import { format, isToday, isTomorrow, isThisWeek, isThisMonth } from 'date-fns';
import { supabase } from '../../lib/supabase';
import AppointmentDetailsModal from './AppointmentDetailsModal';

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

const UpcomingAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchAppointments();
    // Set up real-time subscription for appointments
    const subscription = supabase
      .channel('appointments_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments'
        },
        () => {
          fetchAppointments();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', today.toISOString().split('T')[0])
        .order('date', { ascending: true })
        .order('start_time', { ascending: true })
        .limit(10);

      if (error) throw error;
      
      // Sort appointments by date and time
      const sortedAppointments = (data || []).sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.start_time}`);
        const dateB = new Date(`${b.date}T${b.start_time}`);
        return dateA.getTime() - dateB.getTime();
      });
      
      setAppointments(sortedAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedAppointment) return;

    try {
      setDeleteLoading(selectedAppointment.id);
      setError(null);

      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', selectedAppointment.id);

      if (error) throw error;

      setAppointments(prev => prev.filter(apt => apt.id !== selectedAppointment.id));
      setShowDeleteModal(false);
      setSelectedAppointment(null);
    } catch (error) {
      console.error('Error deleting appointment:', error);
      setError('Failed to delete appointment');
    } finally {
      setDeleteLoading(null);
    }
  };

  const getDateDisplay = (date: string) => {
    const appointmentDate = new Date(date);
    if (isToday(appointmentDate)) return 'Today';
    if (isTomorrow(appointmentDate)) return 'Tomorrow';
    if (isThisWeek(appointmentDate)) return format(appointmentDate, 'EEEE');
    if (isThisMonth(appointmentDate)) return format(appointmentDate, 'MMMM d');
    return format(appointmentDate, 'MMM d, yyyy');
  };

  const groupAppointmentsByDate = () => {
    const groups: { [key: string]: Appointment[] } = {};
    appointments.forEach(apt => {
      const dateDisplay = getDateDisplay(apt.date);
      if (!groups[dateDisplay]) {
        groups[dateDisplay] = [];
      }
      groups[dateDisplay].push(apt);
    });
    return groups;
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-dark-700 rounded w-1/3"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const groupedAppointments = groupAppointmentsByDate();

  return (
    <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700">
      <div className="p-4 border-b border-gray-200 dark:border-dark-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Appointments</h2>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}

      <div className="divide-y divide-gray-200 dark:divide-dark-700">
        {Object.entries(groupedAppointments).length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            <div className="py-8">
              <CalendarIcon className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Upcoming Appointments</p>
              <p className="text-sm">Your schedule is clear. Click the "New Appointment" button to add one.</p>
            </div>
          </div>
        ) : (
          Object.entries(groupedAppointments).map(([dateDisplay, dateAppointments]) => (
            <div key={dateDisplay} className="p-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">{dateDisplay}</h3>
              <div className="space-y-3">
                {dateAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="group bg-gray-50 dark:bg-dark-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {appointment.title}
                        </h4>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="h-4 w-4 mr-1.5" />
                          {appointment.start_time} - {appointment.end_time}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Mail className="h-4 w-4 mr-1.5" />
                          {appointment.client_email}
                        </div>
                        {appointment.address_line1 && (
                          <div className="flex items-start text-sm text-gray-500 dark:text-gray-400">
                            <MapPin className="h-4 w-4 mr-1.5 mt-0.5" />
                            <div>
                              <div>{appointment.address_line1}</div>
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
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleDelete(appointment)}
                          disabled={deleteLoading === appointment.id}
                          className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                          aria-label="Delete appointment"
                        >
                          {deleteLoading === appointment.id ? (
                            <div className="h-5 w-5 border-2 border-red-600 dark:border-red-500 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash2 className="h-5 w-5" />
                          )}
                        </button>
                        <a
                          href={`/schedule/appointments/${appointment.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedAppointment(appointment);
                            setShowDetailsModal(true);
                          }}
                          className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 group"
                          title="View appointment details"
                        >
                          <ArrowUpRight className="h-5 w-5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-800 rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Cancel Appointment
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Are you sure you want to cancel this appointment? This action cannot be undone.
                    A cancellation email will be sent to {selectedAppointment.client_email}.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-dark-700 px-6 py-4 flex justify-end space-x-4 rounded-b-xl">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Keep Appointment
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteLoading === selectedAppointment.id}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {deleteLoading === selectedAppointment.id ? 'Cancelling...' : 'Cancel Appointment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedAppointment && (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedAppointment(null);
          }}
        />
      )}
    </div>
  );
};

export default UpcomingAppointments;