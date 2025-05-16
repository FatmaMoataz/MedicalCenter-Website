import React from 'react';

const DashboardSidebar = () => {
  return (
    <div className="w-60 h-screen bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-6">Patient Dashboard</h2>
      <ul>
        <li className="py-2 hover:bg-gray-700 px-2 rounded">Overview</li>
        <li className="py-2 hover:bg-gray-700 px-2 rounded">Users</li>
        <li className="py-2 hover:bg-gray-700 px-2 rounded">Appointments</li>
        <li className="py-2 hover:bg-gray-700 px-2 rounded">Settings</li>
      </ul>
    </div>
  );
};

export default DashboardSidebar;
