// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AddCustomer from "./AddCustomer";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [attendanceToday, setAttendanceToday] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin');
  };

  const fetchAttendance = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/admin/today-attendance?date=${selectedDate}`);
      setAttendanceToday(res.data);
    } catch (error) {
      console.error("Failed to fetch attendance:", error);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate]);

  const filteredAttendance = attendanceToday
    .filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-yellow-300">MealMate</h1>
        <h2 className="text-3xl font-semibold text-yellow-300">Admin Dashboard</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold"
        >
          Logout
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add New Customer */}
        <div className="bg-purple-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4">Add New Customer</h3>
          <AddCustomer />
        </div>

        {/* Mark Attendance */}
        <div className="bg-purple-800 p-6 rounded-xl shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-4">Mark Attendance</h3>
            <p className="mb-4">Use face recognition to mark customer attendance quickly.</p>
          </div>
          <button
            onClick={() => navigate('/admin/mark-attendance')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            Mark Attendance
          </button>
        </div>

        {/* Daily Analytics */}
        <div className="bg-purple-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4">Daily Analytics</h3>
        </div>

        {/* Customer List */}
        <div className="bg-purple-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4">Customer List</h3>
        </div>

        {/* Frequent Visitors */}
        <div className="col-span-1 md:col-span-2 bg-purple-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4">Frequent Visitors</h3>
        </div>

        {/* Today's Attendance */}
        <div className="col-span-1 md:col-span-2 bg-white p-4 rounded-lg shadow-lg w-full mt-8 text-purple-900">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <h3 className="text-xl font-bold">Today's Attendance (A-Z)</h3>

            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                placeholder="🔍 Search by name"
                className="p-2 rounded-md text-black w-48"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <input
                type="date"
                className="p-2 rounded-md text-black"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              <button
                onClick={() => {
                  axios.get(`http://localhost:5000/admin/today-attendance?date=${selectedDate}`)
                    .then((res) => setAttendanceToday(res.data))
                    .catch((err) => console.error("Refresh failed", err));
                }}
                className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-md text-white font-medium"
              >
                🔄 Refresh
              </button>
            </div>
          </div>

          {filteredAttendance.length === 0 ? (
            <p className="text-gray-600">No customers marked attendance yet.</p>
          ) : (
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {filteredAttendance.map((customer, index) => {
                const lastMeal = customer.meals_today.at(-1);
                const method = lastMeal?.method || 'unknown';
                const methodColor = method === 'manual' ? 'bg-red-200' : 'bg-green-200';

                return (
                  <li
                    key={index}
                    className={`p-3 rounded-md flex justify-between items-center ${methodColor}`}
                  >
                    <span className="font-semibold">{customer.name}</span>
                    <span className="ml-2 text-sm text-gray-600">
                      ({customer.meals_today.length} meal{customer.meals_today.length > 1 ? 's' : ''}, method: {method})
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
