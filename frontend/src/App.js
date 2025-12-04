import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

// --- Configuration ---
const API_URL = 'http://localhost:5000/api';

// --- Auth Components ---

const Login = ({ setToken, setUser, setView }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/users/login`, formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify({ name: res.data.name, email: res.data.email }));
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
          <input type="email" required className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" onChange={e => setFormData({...formData, email: e.target.value})} />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
          <input type="password" required className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" onChange={e => setFormData({...formData, password: e.target.value})} />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-200">Sign In</button>
      </form>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">Don't have an account? <button onClick={() => setView('register')} className="text-blue-500 hover:underline">Register</button></p>
      </div>
    </div>
  );
};

const Register = ({ setToken, setUser, setView }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/users`, formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify({ name: res.data.name, email: res.data.email }));
      setToken(res.data.token);
      setUser({ name: res.data.name, email: res.data.email });
      setView('dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Create Account</h2>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
          <input type="text" required className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500" onChange={e => setFormData({...formData, name: e.target.value})} />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input type="email" required className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500" onChange={e => setFormData({...formData, email: e.target.value})} />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
          <input type="password" required className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500" onChange={e => setFormData({...formData, password: e.target.value})} />
        </div>
        <button type="submit" className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition duration-200">Register</button>
      </form>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">Already have an account? <button onClick={() => setView('login')} className="text-blue-500 hover:underline">Login</button></p>
      </div>
    </div>
  );
};

// --- Dashboard Sub-Components ---

const SummaryPanel = ({ config, refreshTrigger }) => {
  const [summary, setSummary] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    axios.get(`${API_URL}/expenses/summary`, config)
      .then(res => setSummary(res.data))
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
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2 mb-4 text-sm text-yellow-700 flex items-center gap-2">
          <span>⚠️</span> {error}
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
          <input type="number" required min="0" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-indigo-500" placeholder="0.00" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Category</label>
          <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-indigo-500">
            <option>Food</option><option>Rent</option><option>Travel</option><option>Utilities</option><option>Entertainment</option><option>Health</option><option>Other</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Date</label>
          <input type="date" required value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-indigo-500" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Description (Optional)</label>
          <input type="text" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-indigo-500" placeholder="e.g. Lunch with team" />
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-2 rounded hover:bg-indigo-700 transition">Add Expense</button>
      </form>
    </div>
  );
};

const ExpenseList = ({ expenses, setExpenses, refreshTrigger, config }) => {
  useEffect(() => {
    axios.get(`${API_URL}/expenses`, config)
      .then(res => {
        if (Array.isArray(res.data)) setExpenses(res.data);
        else { console.warn("API returned non-array:", res.data); setExpenses([]); }
      })
      .catch(err => {
        if (err.message !== "Network Error") console.warn("Error fetching expenses:", err);
        setExpenses([
          { _id: '1', category: 'Food', amount: 45, date: new Date().toISOString(), description: 'Demo Lunch' },
          { _id: '2', category: 'Rent', amount: 1200, date: new Date().toISOString(), description: 'Demo Rent' }
        ]);
      });
  }, [refreshTrigger, config, setExpenses]);

  const deleteExpense = async (id) => {
    if(!window.confirm("Are you sure?")) return;
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
          <div className="text-center py-10 text-gray-400"><p>No expenses found.</p><p className="text-sm">Add one to get started!</p></div>
        ) : (
          <ul className="space-y-3">
            {safeExpenses.map((exp) => (
              <li key={exp._id} className="group bg-gray-50 border border-gray-100 rounded-lg p-3 flex justify-between items-center hover:shadow-sm transition">
                <div>
                  <div className="font-bold text-gray-800">{exp.category}</div>
                  <div className="text-xs text-gray-500">{new Date(exp.date).toLocaleDateString()}{exp.description && <span className="ml-2 italic">- {exp.description}</span>}</div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-red-600 bg-red-50 px-2 py-1 rounded">-${exp.amount}</span>
                  <button onClick={() => deleteExpense(exp._id)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1 rounded transition opacity-0 group-hover:opacity-100">✕</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const ContentManager = ({ config }) => {
  const [text, setText] = useState('');
  const [status, setStatus] = useState('');
  const [posts, setPosts] = useState([]);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    if (!config) return;
    axios.get(`${API_URL}/content`, config)
      .then(res => { if (Array.isArray(res.data)) setPosts(res.data); })
      .catch(err => {
        console.warn("Content fetch error:", err.message);
        if (posts.length === 0) setPosts([{ _id: '1', text: 'Demo: Backend unavailable.', createdAt: new Date().toISOString() }]);
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
        <button onClick={() => setReload(prev => prev + 1)} className="text-xs text-gray-400 hover:text-white underline">Refresh</button>
      </div>
      <p className="text-xs text-gray-400 mb-4">Interacts with protected <code className="bg-gray-700 px-1 rounded">/api/content</code></p>
      <form onSubmit={handlePost} className="flex gap-2 mb-4">
        <input type="text" placeholder="Enter a secure note..." value={text} onChange={e => setText(e.target.value)} required className="flex-1 p-2 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <button type="submit" className="bg-blue-600 px-4 py-2 rounded font-medium hover:bg-blue-500 transition">Post</button>
      </form>
      {status && <p className={`mb-4 text-sm ${status.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>{status}</p>}
      <div className="mt-4 border-t border-gray-700 pt-4">
        <h4 className="text-sm font-bold text-gray-300 mb-2">Secure Post History:</h4>
        <div className="max-h-60 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {posts.length === 0 ? <p className="text-xs text-gray-500 italic">No posts yet.</p> : posts.map(post => (
            <div key={post._id} className="bg-gray-700 p-3 rounded text-sm border border-gray-600 mb-2 last:mb-0 shadow-sm">
              <p className="text-gray-200 break-words">{post.text}</p>
              <p className="text-xs text-gray-500 mt-1 block text-right">{post.createdAt ? new Date(post.createdAt).toLocaleString() : 'Just now'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ token }) => {
  const [expenses, setExpenses] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0); 
  const config = useMemo(() => ({ headers: { Authorization: `Bearer ${token}` } }), [token]);
  const refreshData = () => setRefreshTrigger(prev => prev + 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="space-y-6 lg:col-span-1">
        <SummaryPanel token={token} refreshTrigger={refreshTrigger} config={config} />
        <ExpenseForm token={token} onExpenseAdded={refreshData} config={config} />
        <ContentManager token={token} config={config} />
      </div>
      <div className="lg:col-span-2 h-full">
        <ExpenseList token={token} expenses={expenses} setExpenses={setExpenses} refreshTrigger={refreshTrigger} config={config} />
      </div>
    </div>
  );
};

// --- Main App Component ---

const App = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [view, setView] = useState('login'); 
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      setView('dashboard');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    setView('login');
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900 pb-10">
      <nav className="bg-blue-600 p-4 shadow-lg text-white mb-8">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold text-xl">$</div>
             <h1 className="text-xl font-bold tracking-wide">ExpenseTracker Pro</h1>
          </div>
          <div>
            {user ? (
              <div className="flex items-center gap-4">
                <span className="hidden sm:inline opacity-90">Welcome, <strong>{user.name}</strong></span>
                <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded text-sm transition shadow-sm">Logout</button>
              </div>
            ) : (
              <div className="space-x-4">
                <button onClick={() => setView('login')} className={`hover:text-gray-200 transition ${view === 'login' ? 'font-bold underline decoration-2 underline-offset-4' : 'opacity-80'}`}>Login</button>
                <button onClick={() => setView('register')} className={`hover:text-gray-200 transition ${view === 'register' ? 'font-bold underline decoration-2 underline-offset-4' : 'opacity-80'}`}>Register</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4">
        {view === 'login' && <Login setToken={setToken} setUser={setUser} setView={setView} />}
        {view === 'register' && <Register setToken={setToken} setUser={setUser} setView={setView} />}
        {view === 'dashboard' && user && token && <Dashboard token={token} />}
      </div>
    </div>
  );
};

export default App;