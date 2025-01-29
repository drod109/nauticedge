import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Mail, MapPin, Calendar, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import { Theme, getInitialTheme, setTheme } from '../lib/theme';
import ProtectedRoute from '../components/auth/ProtectedRoute';

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

const AppointmentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [theme, setCurrentTheme] = useState<Theme>(getInitialTheme());
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setCurrentTheme(newTheme);
  };

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        if (!id) return;

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Appointment not found');

        setAppointment(data);
      } catch (error) {
        console.error('Error fetching appointment:', error);
        setError(error instanceof Error ? error.message : 'Failed to load appointment details');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [id]);

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50 dark:bg-dark-900">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header theme={theme} onThemeChange={handleThemeChange} />
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mb-6"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Schedule
              </button>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="h-8 w-8 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin"></div>
                </div>
              ) : error ? (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                </div>
              ) : appointment ? (
                <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700">
                  <div className="p-6 border-b border-gray-200 dark:border-dark-700">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {appointment.title}
                    </h1>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 mr-3 text-gray-400 dark:text-gray-500" />
                          <span className="text-gray-900 dark:text-white">
                            {format(new Date(appointment.date), 'MMMM d, yyyy')}
                          </span>
                        </div>

                        <div className="flex items-center">
                          <Clock className="h-5 w-5 mr-3 text-gray-400 dark:text-gray-500" />
                          <span className="text-gray-900 dark:text-white">
                            {appointment.start_time} - {appointment.end_time}
                          </span>
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
                      </div>

                      {(appointment.address_line1 || appointment.city) && (
                        <div className="flex items-start">
                          <MapPin className="h-5 w-5 mr-3 mt-0.5 text-gray-400 dark:text-gray-500" />
                          <div className="text-gray-900 dark:text-white">
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
                      <div>
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          Description
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                          {appointment.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">Appointment not found</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AppointmentDetails;