import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const ExpenseForm = ({ onExpenseAdded, config }) => {
  const [form, setForm] = useState({ amount: '', category: 'Food', description: '', date: '' });
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/expenses`, form, config);
      setMsg('Expense added successfully!');
      setForm({ amount: '', category: 'Food', description: '', date: '' }); // Reset form
      onExpenseAdded(); // Notify parent to refresh data
      
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      console.error(err);
      setMsg('Error adding expense');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4 text-gray-800">Add New Expense</h3>
      {msg && <div className={`mb-3 text-sm font-bold ${msg.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>{msg}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Amount</label>
          <input 
            type="number" 
            required
            min="0"
            value={form.amount}
            onChange={e => setForm({...form, amount: e.target.value})}
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-indigo-500"
            placeholder="0.00"
          />
        </div>
        
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Category</label>
          <select 
            value={form.category}
            onChange={e => setForm({...form, category: e.target.value})}
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-indigo-500"
          >
            <option>Food</option>
            <option>Rent</option>
            <option>Travel</option>
            <option>Utilities</option>
            <option>Entertainment</option>
            <option>Health</option>
            <option>Other</option>
          </select>
        </div>
        
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Date</label>
          <input 
            type="date" 
            required
            value={form.date}
            onChange={e => setForm({...form, date: e.target.value})}
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-indigo-500"
          />
        </div>
        
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Description (Optional)</label>
          <input 
            type="text" 
            value={form.description}
            onChange={e => setForm({...form, description: e.target.value})}
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-indigo-500"
            placeholder="e.g. Lunch with team"
          />
        </div>
        
        <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-2 rounded hover:bg-indigo-700 transition">
          Add Expense
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;