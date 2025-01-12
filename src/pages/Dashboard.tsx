import React from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import DashboardContent from '../components/dashboard/DashboardContent';

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <DashboardContent />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;