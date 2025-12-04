import React, { useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const ExpenseList = ({ expenses, setExpenses, refreshTrigger, config }) => {
  
  // Fetch expenses when the component mounts or when data changes
  useEffect(() => {
    axios.get(`${API_URL}/expenses`, config)
      .then(res => {
        // Ensure the response is actually an array before setting state
        if (Array.isArray(res.data)) {
            setExpenses(res.data);
        } else {
            console.warn("API returned non-array data for expenses:", res.data);
            setExpenses([]); // Fallback to empty list to prevent crash
        }
      })
      .catch(err => {
        console.error("Error fetching expenses:", err);
        // On error, we might want to keep the old data or clear it. 
        // For now, logging is sufficient, but let's ensure we don't crash.
      });
  }, [refreshTrigger, config, setExpenses]);

  const deleteExpense = async (id) => {
    if(!window.confirm("Are you sure you want to delete this expense?")) return;
    try {
      await axios.delete(`${API_URL}/expenses/${id}`, config);
      // Optimistic update: remove from UI immediately
      setExpenses(expenses.filter(exp => exp._id !== id));
    } catch (err) {
      alert("Failed to delete expense");
    }
  };

  // Safe fallback: ensure expenses is always an array
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

export default ExpenseList;