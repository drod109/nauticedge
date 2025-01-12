import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  BarChart,
  Calendar,
  LogOut,
  Ship,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: FileText, label: 'Surveys', href: '/dashboard/surveys' },
  { icon: Users, label: 'Clients', href: '/dashboard/clients' },
  { icon: Calendar, label: 'Schedule', href: '/dashboard/schedule' },
  { icon: BarChart, label: 'Analytics', href: '/dashboard/analytics' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`relative h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'}`}>
        <Ship className="h-8 w-8 text-blue-600 shrink-0" />
        {!isCollapsed && <span className="text-xl font-bold">NauticEdge</span>}
      </div>
      
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-16 bg-white border border-gray-200 rounded-full p-1.5 hover:bg-gray-50"
      >
        {isCollapsed ? 
          <ChevronRight className="h-4 w-4 text-gray-600" /> : 
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        }
      </button>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors`}
                title={isCollapsed ? item.label : ''}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <button className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-2.5 w-full rounded-lg text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-colors`}>
          <LogOut className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;