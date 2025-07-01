// src/pages/ResetPassword.jsx
import React, { useState } from 'react';
import axios from 'axios';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();

    if (!email || !resetToken || !newPassword) {
      setMessage('⚠️ All fields are required');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/admin/reset-password', {
        email,
        reset_token: resetToken,
        new_password: newPassword
      });

      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-500 text-white">
      <form onSubmit={handleReset} className="bg-purple-900 p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-yellow-400 text-center">Reset Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 rounded-xl outline-none bg-purple-800 placeholder-gray-300"
          required
        />

        <input
          type="text"
          placeholder="Enter Reset Token"
          value={resetToken}
          onChange={(e) => setResetToken(e.target.value)}
          className="w-full p-3 mb-4 rounded-xl outline-none bg-purple-800 placeholder-gray-300"
          required
        />

        <input
          type="password"
          placeholder="Enter New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-3 mb-4 rounded-xl outline-none bg-purple-800 placeholder-gray-300"
          required
        />

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold"
        >
          Reset Password
        </button>

        {message && <p className="mt-4 text-sm text-center text-yellow-200">{message}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;
