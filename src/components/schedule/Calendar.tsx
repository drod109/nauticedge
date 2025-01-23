import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Mail, Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { supabase } from '../../lib/supabase';

interface Appointment {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  clientEmail: string;
  description?: string;
}

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [newAppointment, setNewAppointment] = useState({
    title: '',
    start_time: '',
    end_time: '',
    client_email: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Fetch appointments for the current month
  const fetchAppointments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const startDate = format(monthStart, 'yyyy-MM-dd');
      const endDate = format(monthEnd, 'yyyy-MM-dd');

      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
      setFetchError(null);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setFetchError('Failed to load appointments');
    }
  };

  // Fetch appointments when month changes
  useEffect(() => {
    fetchAppointments();
  }, [currentDate]);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowAppointmentModal(true);
  };

  const handleAddAppointment = async () => {
    if (!selectedDate || !newAppointment.start_time || !newAppointment.client_email) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const appointment = {
        user_id: user.id,
        date: format(selectedDate, 'yyyy-MM-dd'),
        start_time: newAppointment.start_time,
        end_time: newAppointment.end_time,
        client_email: newAppointment.client_email,
        address_line1: newAppointment.address_line1,
        address_line2: newAppointment.address_line2,
        city: newAppointment.city,
        state: newAppointment.state,
        postal_code: newAppointment.postal_code,
        country: newAppointment.country,
        description: newAppointment.description,
        ...newAppointment
      };

      const { error } = await supabase
        .from('appointments')
        .insert([appointment]);

      if (error) throw error;

      // Refresh appointments after creating new one
      await fetchAppointments();

      // Create calendar event
      if ('google' in window) {
        const event = {
          'summary': newAppointment.title,
          'description': newAppointment.description,
          'start': {
            'dateTime': `${appointment.date}T${newAppointment.start_time}:00`,
            'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
          },
          'end': {
            'dateTime': `${appointment.date}T${newAppointment.end_time}:00`,
            'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
          },
          'attendees': [{ 'email': newAppointment.client_email }],
          'reminders': {
            'useDefault': false,
            'overrides': [
              { 'method': 'email', 'minutes': 24 * 60 },
              { 'method': 'popup', 'minutes': 30 }
            ]
          }
        };

        // Add to Google Calendar
        const request = window.gapi.client.calendar.events.insert({
          'calendarId': 'primary',
          'resource': event,
          'sendUpdates': 'all'
        });

        request.execute((event: any) => {
          console.log('Event created:', event.htmlLink);
        });
      }

      setShowAppointmentModal(false);
      setNewAppointment({
        title: '',
        start_time: '',
        end_time: '',
        client_email: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        postal_code: '',
        country: '',
        description: ''
      });
    } catch (error) {
      console.error('Error creating appointment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700">
      {/* Calendar Header */}
      <div className="p-4 border-b border-gray-200 dark:border-dark-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-full"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <button
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-full"
            >
              <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          <button
            onClick={() => {
              setSelectedDate(new Date());
              setShowAppointmentModal(true);
            }}
            className="flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Appointment
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-900 dark:text-white p-2"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {daysInMonth.map((date) => (
            <button
              key={date.toString()}
              onClick={() => handleDateClick(date)}
              className={`
                relative aspect-square p-2 rounded-lg border border-gray-200 dark:border-dark-700 text-gray-900 dark:text-white
                ${isSameMonth(date, currentDate)
                  ? 'hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                  : 'text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-dark-700'
                }
                ${isSameDay(date, selectedDate || new Date())
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-400'
                  : ''
                }
              `}
            >
              <div className="absolute top-1 left-1.5 text-sm font-medium">
                {format(date, 'd')}
              </div>
              {appointments
                .filter(apt => isSameDay(new Date(apt.date), date))
                .map((apt, idx) => (
                  <div 
                    key={apt.id}
                    className="mt-6 text-xs truncate px-1"
                    title={`${apt.title} (${apt.start_time} - ${apt.end_time})`}
                  >
                    {apt.title}
                  </div>
                ))
              }
            </button>
          ))}
        </div>
      </div>

      {/* Appointment Modal */}
      {showAppointmentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#1b2838] rounded-xl shadow-2xl max-w-md w-full my-8">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h3 className="text-lg font-medium text-white">New Appointment</h3>
              <button
                onClick={() => setShowAppointmentModal(false)}
                className="text-gray-400 hover:text-gray-300 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newAppointment.title || ''}
                  onChange={(e) => setNewAppointment(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-[#2a3f5a] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors hover:bg-[#344863]"
                  placeholder="Appointment title"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Start Time
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="time"
                      value={newAppointment.start_time || ''}
                      onChange={(e) => setNewAppointment(prev => ({ ...prev, start_time: e.target.value }))}
                      className="w-full pl-10 px-4 py-2.5 bg-[#2a3f5a] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors hover:bg-[#344863] [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-clear-button]:hidden"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    End Time
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="time"
                      value={newAppointment.end_time || ''}
                      onChange={(e) => setNewAppointment(prev => ({ ...prev, end_time: e.target.value }))}
                      className="w-full pl-10 px-4 py-2.5 bg-[#2a3f5a] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors hover:bg-[#344863] [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-clear-button]:hidden"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Client Email
                </label>
                <input
                  type="email"
                  value={newAppointment.client_email || ''}
                  onChange={(e) => setNewAppointment(prev => ({ ...prev, client_email: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-[#2a3f5a] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors hover:bg-[#344863]"
                  placeholder="client@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Address Line 1
                </label>
                <input
                  type="text"
                  value={newAppointment.address_line1 || ''}
                  onChange={(e) => setNewAppointment(prev => ({ ...prev, address_line1: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-[#2a3f5a] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors hover:bg-[#344863]"
                  placeholder="Street address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Address Line 2
                </label>
                <input
                  type="text"
                  value={newAppointment.address_line2 || ''}
                  onChange={(e) => setNewAppointment(prev => ({ ...prev, address_line2: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-[#2a3f5a] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors hover:bg-[#344863]"
                  placeholder="Suite, unit, building, etc. (optional)"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={newAppointment.city || ''}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-[#2a3f5a] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors hover:bg-[#344863]"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={newAppointment.state || ''}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-[#2a3f5a] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors hover:bg-[#344863]"
                    placeholder="State"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={newAppointment.postal_code || ''}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, postal_code: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-[#2a3f5a] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors hover:bg-[#344863]"
                    placeholder="Postal code"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={newAppointment.country || ''}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-[#2a3f5a] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors hover:bg-[#344863]"
                    placeholder="Country"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newAppointment.description || ''}
                  onChange={(e) => setNewAppointment(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-[#2a3f5a] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors hover:bg-[#344863]"
                  placeholder="Add appointment details..."
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-700 flex justify-end space-x-4">
              <button
                onClick={() => setShowAppointmentModal(false)}
                className="px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white bg-[#2a3f5a] rounded-lg hover:bg-[#344863] transition-colors focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-[#1b2838]"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAppointment}
                disabled={loading}
                className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#1b2838]"
              >
                {loading ? 'Creating...' : 'Create Appointment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;