// src/pages/AdminLogin.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // ✅ Add useNavigate for redirect

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // ✅ Hook to redirect after login

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/admin/login', {
        email,
        password,
      });

      const token = response.data.token;
      localStorage.setItem('token', token); // ✅ Save token (optional)

      setMessage('Login successful ✅');
      
      // ✅ Redirect after short delay
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1000);
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.error);
      } else {
        setMessage('Something went wrong!');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-600">
      <form
        onSubmit={handleSubmit}
        className="bg-purple-900 p-8 rounded-2xl shadow-xl w-96"
      >
        <h1 className="text-4xl font-bold text-center text-yellow-400 mb-6">
          Admin Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded-xl outline-none text-white bg-purple-800 placeholder-gray-300"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-2 rounded-xl outline-none text-white bg-purple-800 placeholder-gray-300"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Link
          to="/forgot-password"
          className="text-sm text-gray-300 mb-4 block hover:underline text-right"
        >
          Forgot password?
        </Link>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 text-white font-semibold"
        >
          Login
        </button>

        {message && (
          <p className="text-center mt-4 text-white font-semibold">{message}</p>
        )}
      </form>
    </div>
  );
};

export default AdminLogin;
