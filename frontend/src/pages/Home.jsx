import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white">
      <div className="text-center px-6">
        <h1 className="text-5xl font-extrabold mb-2">MealMate</h1>
        <h2 className="text-2xl font-semibold text-yellow-300 mb-2">
          The Taste of Indore
        </h2>
        <p className="text-lg mb-8">Login as your role to continue.</p>

        <div className="bg-[#2C1250] p-10 rounded-3xl shadow-2xl max-w-sm mx-auto">
          <h3 className="text-3xl font-bold text-yellow-400 mb-6">Login As</h3>
          <div className="flex justify-center gap-6">
            <button
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full font-semibold text-white hover:scale-105 transition"
              onClick={() => navigate("/admin/login")}
            >
              Admin
            </button>
            <button
              className="px-6 py-3 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full font-semibold text-white hover:scale-105 transition"
              onClick={() => navigate("/customer/login")}
            >
              Customer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
