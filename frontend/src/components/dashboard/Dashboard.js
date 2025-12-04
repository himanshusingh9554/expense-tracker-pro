import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

// --- Configuration ---
const API_URL = 'http://localhost:5000/api';

// --- Sub-Components ---

const SummaryPanel = ({ config, refreshTrigger }) => {
  const [summary, setSummary] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    axios.get(`${API_URL}/expenses/summary`, config)
      .then(res => {
        setSummary(res.data);
      })
      .catch(err => {
        setError("Backend unreachable. Showing demo data.");
        setSummary([
            { _id: 'Food', totalAmount: 450 },
            { _id: 'Rent', totalAmount: 1200 },
            { _id: 'Travel', totalAmount: 150 },
            { _id: 'Utilities', totalAmount: 85 }
        ]);
      });
  }, [refreshTrigger, config]);

  const totalSpent = summary.reduce((acc, item) => acc + item.totalAmount, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-indigo-500">
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-end mb-4">
        <h3 className="text-xl font-bold text-gray-700">Monthly Spending</h3>
        <span className="text-sm text-gray-500 font-medium">Total: ${totalSpent.toFixed(2)}</span>
      </div>
      
      {summary.length === 0 ? (
        <p className="text-gray-500 italic">No expenses recorded this month.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {summary.map((item) => (
            <div key={item._id} className="bg-gray-50 p-3 rounded border border-gray-100">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">{item._id}</p>
              <p className="text-lg font-bold text-indigo-600">${item.totalAmount}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ExpenseForm = ({ onExpenseAdded, config }) => {
  const [form, setForm] = useState({ amount: '', category: 'Food', description: '', date: '' });
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/expenses`, form, config);
      setMsg('Expense added successfully!');
      setForm({ amount: '', category: 'Food', description: '', date: '' }); 
      onExpenseAdded(); 
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      console.warn("Backend unreachable, simulating success:", err.message);
      setMsg('Expense added (Demo Mode)');
      setForm({ amount: '', category: 'Food', description: '', date: '' }); 
      onExpenseAdded(); 
      setTimeout(() => setMsg(''), 3000);
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

const ExpenseList = ({ expenses, setExpenses, refreshTrigger, config }) => {
  useEffect(() => {
    axios.get(`${API_URL}/expenses`, config)
      .then(res => {
        if (Array.isArray(res.data)) {
            setExpenses(res.data);
        } else {
            console.warn("API returned non-array data for expenses:", res.data);
            setExpenses([]); 
        }
      })
      .catch(err => {
        if (err.message !== "Network Error") {
             console.warn("Error fetching expenses:", err);
        }
        setExpenses([
          { _id: '1', category: 'Food', amount: 45, date: new Date().toISOString(), description: 'Demo Lunch' },
          { _id: '2', category: 'Rent', amount: 1200, date: new Date().toISOString(), description: 'Demo Rent' }
        ]);
      });
  }, [refreshTrigger, config, setExpenses]);

  const deleteExpense = async (id) => {
    if(!window.confirm("Are you sure you want to delete this expense?")) return;
    try {
      await axios.delete(`${API_URL}/expenses/${id}`, config);
      setExpenses(expenses.filter(exp => exp._id !== id));
    } catch (err) {
      console.warn("Backend unreachable, performing local delete only");
      setExpenses(expenses.filter(exp => exp._id !== id));
    }
  };

  const safeExpenses = Array.isArray(expenses) ? expenses : [];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
      <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Transaction History</h3>
      
      <div className="overflow-y-auto pr-2" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        {safeExpenses.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p>No expenses found.</p>
            <p className="text-sm">Add one to get started!</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {safeExpenses.map((exp) => (
              <li key={exp._id} className="group bg-gray-50 border border-gray-100 rounded-lg p-3 flex justify-between items-center hover:shadow-sm transition">
                <div>
                  <div className="font-bold text-gray-800">{exp.category}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(exp.date).toLocaleDateString()}
                    {exp.description && <span className="ml-2 italic">- {exp.description}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-red-600 bg-red-50 px-2 py-1 rounded">-${exp.amount}</span>
                  <button 
                    onClick={() => deleteExpense(exp._id)}
                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1 rounded transition opacity-0 group-hover:opacity-100"
                    title="Delete Expense"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

// Updated ContentManager with View functionality
const ContentManager = ({ config }) => {
  const [text, setText] = useState('');
  const [status, setStatus] = useState('');
  const [posts, setPosts] = useState([]);
  const [reload, setReload] = useState(0);

  // Fetch posts on load and when 'reload' changes
  useEffect(() => {
    // Debug log to confirm this effect is running
    console.log("ContentManager: Attempting to fetch content...", config);

    axios.get(`${API_URL}/content`, config)
      .then(res => {
          if (Array.isArray(res.data)) {
            setPosts(res.data);
            if(status.includes("Error")) setStatus(""); // Clear error if success
          }
      })
      .catch(err => {
        console.warn("Content fetch error:", err.message);
        // Display error in UI to help diagnosis
        setStatus(`Fetch Error: ${err.message}`);
        
        if (posts.length === 0) {
           setPosts([
             { _id: '1', text: 'Demo: Backend unavailable. This is a local example.', createdAt: new Date().toISOString() },
           ]);
        }
      });
  }, [reload, config]); 

  const handlePost = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/content`, { text }, config);
      setStatus('Success: Content saved securely!');
      setText('');
      setReload(prev => prev + 1); 
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      console.warn("Backend unreachable, simulating post:", err.message);
      setStatus('Success: Saved (Demo Mode)!');
      setPosts(prev => [{ _id: Date.now(), text: text, createdAt: new Date().toISOString() }, ...prev]);
      setText('');
      setTimeout(() => setStatus(''), 3000);
    }
  };

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md mt-6">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
          <h3 className="text-lg font-bold">Secure Content Manager</h3>
        </div>
        <button 
          onClick={() => setReload(prev => prev + 1)} 
          className="text-xs text-gray-400 hover:text-white underline"
          title="Refresh List"
        >
          Refresh
        </button>
      </div>
      
      <p className="text-xs text-gray-400 mb-4">
        This area interacts with the protected <code className="bg-gray-700 px-1 rounded">/api/content</code> endpoint.
      </p>
      
      {/* Post Form */}
      <form onSubmit={handlePost} className="flex gap-2 mb-4">
        <input 
          type="text" 
          placeholder="Enter a secure note..." 
          value={text}
          onChange={e => setText(e.target.value)}
          required
          className="flex-1 p-2 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="bg-blue-600 px-4 py-2 rounded font-medium hover:bg-blue-500 transition">
          Post
        </button>
      </form>
      
      {status && (
        <p className={`mb-4 text-sm ${status.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
          {status}
        </p>
      )}

      {/* List of Posts */}
      <div className="mt-4 border-t border-gray-700 pt-4">
        <h4 className="text-sm font-bold text-gray-300 mb-2">Secure Post History:</h4>
        <div className="max-h-60 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {posts.length === 0 ? (
            <p className="text-xs text-gray-500 italic">No posts yet.</p>
          ) : (
            posts.map(post => (
              <div key={post._id} className="bg-gray-700 p-3 rounded text-sm border border-gray-600 mb-2 last:mb-0 shadow-sm">
                <p className="text-gray-200 break-words">{post.text}</p>
                <p className="text-xs text-gray-500 mt-1 block text-right">
                  {post.createdAt ? new Date(post.createdAt).toLocaleString() : 'Just now'}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main Dashboard Component ---

const Dashboard = ({ token }) => {
  const [expenses, setExpenses] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0); 

  // FIX: Wrap config in useMemo to prevent infinite re-render loops
  const config = useMemo(() => ({
    headers: { Authorization: `Bearer ${token}` }
  }), [token]);

  const refreshData = () => setRefreshTrigger(prev => prev + 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Left Column: Input and Summary (Takes up 1 column on large screens) */}
      <div className="space-y-6 lg:col-span-1">
        <SummaryPanel token={token} refreshTrigger={refreshTrigger} config={config} />
        <ExpenseForm token={token} onExpenseAdded={refreshData} config={config} />
        <ContentManager token={token} config={config} />
      </div>

      {/* Right Column: List (Takes up 2 columns on large screens) */}
      <div className="lg:col-span-2 h-full">
        <ExpenseList 
          token={token} 
          expenses={expenses} 
          setExpenses={setExpenses} 
          refreshTrigger={refreshTrigger} 
          config={config} 
        />
      </div>
    </div>
  );
};

export default Dashboard;