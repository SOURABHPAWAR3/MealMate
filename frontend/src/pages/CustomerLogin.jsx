// src/pages/CustomerLogin.jsx
import React from "react";

const CustomerLogin = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-600 text-white">
      <div className="bg-purple-900 p-8 rounded-3xl shadow-lg w-96">
        <h1 className="text-4xl font-bold text-center mb-2">MealMate</h1>
        <p className="text-xl font-semibold text-center text-yellow-400 mb-6">
          The Taste of Indore
        </p>

        <h2 className="text-2xl font-bold text-yellow-400 mb-4 text-center">
          Customer Login
        </h2>

        <form>
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 mb-4 rounded-lg bg-purple-800 placeholder-gray-300 text-white focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 mb-2 rounded-lg bg-purple-800 placeholder-gray-300 text-white focus:outline-none"
          />
          <div className="text-sm text-gray-300 mb-4 hover:underline cursor-pointer text-right">
            Forgot password?
          </div>
          <button
            type="submit"
            className="w-full bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-full"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerLogin;
