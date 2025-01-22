import React, { useState, useEffect } from 'react';
import { Clock, Calendar as CalendarIcon, Mail, User2 } from 'lucide-react';
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
              <div className="flex items-start justify-between">
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
    </div>
  );
};

export default UpcomingAppointments;