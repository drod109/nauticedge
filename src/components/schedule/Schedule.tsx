import React from 'react';
import Calendar from './Calendar';
import UpcomingAppointments from './UpcomingAppointments';

const Schedule = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Calendar />
        </div>
        <div>
          <UpcomingAppointments />
        </div>
      </div>
    </div>
  );
};

export default Schedule;