// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import CustomerLogin from "./pages/CustomerLogin";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/AdminDashboard";
import MarkAttendance from "./pages/MarkAttendance"; // ✅ Import new page

function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ Home Page */}
        <Route path="/" element={<HomePage />} />

        {/* ✅ Admin Flow */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/mark-attendance" element={<MarkAttendance />} /> {/* ✅ New Route */}

        {/* ✅ Customer Flow */}
        <Route path="/customer" element={<CustomerLogin />} />

        {/* ✅ Password Recovery Flow */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-pink-500 to-purple-600 text-white">
      <h1 className="text-5xl font-bold">MealMate</h1>
      <p className="text-xl mt-2 font-semibold">The Taste of Indore</p>
      <p className="mt-1 mb-6">Login as your role to continue.</p>

      <div className="bg-purple-900 p-6 rounded-2xl shadow-xl">
        <h2 className="text-2xl mb-4 font-bold text-yellow-400 text-center">Login As</h2>
        <div className="flex gap-4 justify-center">
          <Link to="/admin">
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full">
              Admin
            </button>
          </Link>
          <Link to="/customer">
            <button className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-6 rounded-full">
              Customer
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;
