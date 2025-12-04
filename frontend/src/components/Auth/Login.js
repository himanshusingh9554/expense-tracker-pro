import React, { useState } from 'react';
import axios from 'axios';

// Defined locally to avoid import resolution errors in the preview environment
const API_URL = 'http://localhost:5000/api';

const Login = ({ setToken, setUser, setView }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/users/login`, formData);
      
      // Store in LocalStorage for persistence
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify({ name: res.data.name, email: res.data.email }));
      
      // Update App state
      setToken(res.data.token);
      setUser({ name: res.data.name, email: res.data.email });
      setView('dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Login to ExpenseTracker</h2>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input 
            type="email" 
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
          <input 
            type="password" 
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            onChange={e => setFormData({...formData, password: e.target.value})}
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-200">
          Sign In
        </button>
      </form>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account? <button onClick={() => setView('register')} className="text-blue-500 hover:underline">Register</button>
        </p>
      </div>
    </div>
  );
};

export default Login;