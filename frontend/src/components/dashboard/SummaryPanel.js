import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Defined locally to ensure the component is self-contained
const API_URL = 'http://localhost:5000/api';

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
        // Changed to console.warn to avoid critical error logs when backend is offline
        console.warn("Backend unreachable (using demo data):", err.message);
        
        // Fallback to demo data on Network Error so the UI is still viewable
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
              <p className="text-sm text-yellow-700">
                {error}
              </p>
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

export default SummaryPanel;