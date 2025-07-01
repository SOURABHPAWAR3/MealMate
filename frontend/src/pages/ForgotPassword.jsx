import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/admin/forgot-password', { email });
      setResetToken(res.data.reset_token);
      setMessage('Token generated ✅. Use it to reset your password below.');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-600 text-white">
      <form onSubmit={handleSubmit} className="bg-purple-900 p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-yellow-400">Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 rounded-xl outline-none bg-purple-800 placeholder-gray-300"
          required
        />
        <button type="submit" className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold">Get Reset Token</button>
        {message && <p className="mt-4 text-sm text-center">{message}</p>}
        {resetToken && (
          <div className="mt-4">
            <p className="text-xs text-yellow-300">Reset Token:</p>
            <code className="block bg-purple-800 p-2 rounded text-sm break-all">{resetToken}</code>
          </div>
        )}
      </form>
    </div>
  );
};

export default ForgotPassword;
