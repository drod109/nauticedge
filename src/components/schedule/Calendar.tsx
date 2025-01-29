import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Mail, Plus, X, ChevronLeft, ChevronRight, MapPin, AlertCircle } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns';
import { supabase } from '../../lib/supabase';

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

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get day names starting from Sunday
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calculate calendar grid including previous/next month days
  const startDay = monthStart.getDay();
  const endDay = 6 - monthEnd.getDay();
  
  const prevMonthDays = startDay > 0 ? Array.from({ length: startDay }, (_, i) => {
    const date = new Date(monthStart);
    date.setDate(date.getDate() - (startDay - i));
    return date;
  }) : [];
  
  const nextMonthDays = endDay > 0 ? Array.from({ length: endDay }, (_, i) => {
    const date = new Date(monthEnd);
    date.setDate(date.getDate() + i + 1);
    return date;
  }) : [];

  const allDays = [...prevMonthDays, ...daysInMonth, ...nextMonthDays];

  useEffect(() => {
    fetchAppointments();
  }, [currentDate]);

  const fetchAppointments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

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
      setError(null);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleNewAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !newAppointment.start_time || !newAppointment.end_time || !newAppointment.title || !newAppointment.client_email) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      // Validate times
      const [startHour, startMinute] = newAppointment.start_time.split(':').map(Number);
      const [endHour, endMinute] = newAppointment.end_time.split(':').map(Number);
      
      if (endHour < startHour || (endHour === startHour && endMinute <= startMinute)) {
        throw new Error('End time must be after start time');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Format times to ensure proper format
      const formattedStartTime = `${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`;
      const formattedEndTime = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;

      const appointment = {
        user_id: user.id,
        date: format(selectedDate, 'yyyy-MM-dd'),
        title: newAppointment.title,
        start_time: formattedStartTime,
        end_time: formattedEndTime,
        client_email: newAppointment.client_email,
        address_line1: newAppointment.address_line1,
        address_line2: newAppointment.address_line2,
        city: newAppointment.city,
        state: newAppointment.state,
        postal_code: newAppointment.postal_code,
        country: newAppointment.country,
        description: newAppointment.description
      };

      const { error } = await supabase
        .from('appointments')
        .insert([appointment]);

      if (error) throw error;

      // Refresh appointments
      await fetchAppointments();

      // Reset form and close modal
      setSelectedDate(null);
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

      // Clear any existing error
      setError(null);
    } catch (error) {
      console.error('Error creating appointment:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to create appointment. Please check all fields and try again.');
      }
    }
  };

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(apt => 
      isSameDay(new Date(apt.date), date)
    );
  };

  return (
    <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700">
      {/* Calendar Header */}
      <div className="p-4 border-b border-gray-200 dark:border-dark-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-full transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <button
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-full transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          <a
            href="#"
            onClick={() => {
              const today = new Date();
              setCurrentDate(today);
              setSelectedDate(today);
              // Clear any existing form data
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
            }}
            className="relative inline-flex items-center justify-center px-4 py-2 overflow-hidden text-sm font-medium text-white transition-all duration-300 ease-out rounded-lg group"
            aria-label="Create new appointment"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 to-blue-400 group-hover:from-blue-400 group-hover:to-blue-600"></span>
            <span className="relative flex items-center">
              <Plus className="h-4 w-4 mr-2 transform group-hover:scale-110 transition-transform" />
              New Appointment
            </span>
          </a>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Day Names */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {allDays.map((date, index) => {
            const isCurrentMonth = isSameMonth(date, currentDate);
            const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
            const isCurrentDate = isToday(date);
            const dateAppointments = getAppointmentsForDate(date);

            return (
              <button
                key={index}
                onClick={() => handleDateClick(date)}
                className={`
                  relative aspect-square p-2 rounded-lg border transition-all duration-200
                  ${isCurrentMonth
                    ? 'border-gray-200 dark:border-dark-700'
                    : 'border-transparent text-gray-400 dark:text-gray-600'
                  }
                  ${isSelected
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-400'
                    : isCurrentMonth
                      ? 'hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                      : ''
                  }
                  ${isCurrentDate && !isSelected
                    ? 'ring-2 ring-blue-500 dark:ring-blue-400'
                    : ''
                  }
                `}
              >
                <div className={`
                  text-sm font-medium mb-1
                  ${isCurrentMonth
                    ? isSelected
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-900 dark:text-white'
                    : 'text-gray-400 dark:text-gray-600'
                  }
                `}>
                  {format(date, 'd')}
                </div>
                
                {/* Appointment Indicators */}
                {dateAppointments.length > 0 && (
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="flex flex-wrap gap-1">
                      {dateAppointments.slice(0, 3).map((apt, idx) => (
                        <div
                          key={apt.id}
                          className="h-1.5 flex-1 rounded-full bg-blue-500 dark:bg-blue-400"
                          title={apt.title}
                        />
                      ))}
                      {dateAppointments.length > 3 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          +{dateAppointments.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Appointments */}
      {selectedDate && (
        <div className="border-t border-gray-200 dark:border-dark-700 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {format(selectedDate, 'MMMM d, yyyy')}
            </h3>
            <button
              onClick={() => setSelectedDate(null)}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleNewAppointment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={newAppointment.title}
                onChange={(e) => setNewAppointment(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Time *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <input
                    type="time"
                    min="00:00"
                    max="23:59"
                    value={newAppointment.start_time}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, start_time: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Enter time in 24-hour format (HH:MM)
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  End Time *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <input
                    type="time"
                    min="00:00"
                    max="23:59"
                    value={newAppointment.end_time}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, end_time: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Must be after start time
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Client Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="email"
                  value={newAppointment.client_email}
                  onChange={(e) => setNewAppointment(prev => ({ ...prev, client_email: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location
              </label>
              <div className="space-y-4">
                <div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      value={newAppointment.address_line1}
                      onChange={(e) => setNewAppointment(prev => ({ ...prev, address_line1: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Address Line 1"
                    />
                  </div>
                </div>
                <input
                  type="text"
                  value={newAppointment.address_line2}
                  onChange={(e) => setNewAppointment(prev => ({ ...prev, address_line2: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Address Line 2 (Optional)"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={newAppointment.city}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="City"
                  />
                  <input
                    type="text"
                    value={newAppointment.state}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="State"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={newAppointment.postal_code}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, postal_code: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Postal Code"
                  />
                  <input
                    type="text"
                    value={newAppointment.country}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Country"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={newAppointment.description}
                onChange={(e) => setNewAppointment(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Add appointment details..."
              />
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-2" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setSelectedDate(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                Create Appointment
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Calendar;