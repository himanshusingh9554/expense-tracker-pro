import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const ContentManager = ({ config }) => {
  const [text, setText] = useState('');
  const [status, setStatus] = useState('');

  const handlePost = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/content`, { text }, config);
      setStatus('Success: Content saved securely!');
      setText('');
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      setStatus('Error: Failed to save content.');
    }
  };

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md mt-6">
      <div className="flex items-center mb-2">
        <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
        <h3 className="text-lg font-bold">Secure Content Manager</h3>
      </div>
      
      <p className="text-xs text-gray-400 mb-4">
        This area interacts with the protected <code className="bg-gray-700 px-1 rounded">/api/content</code> endpoint.
      </p>
      
      <form onSubmit={handlePost} className="flex gap-2">
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
        <p className={`mt-2 text-sm ${status.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
          {status}
        </p>
      )}
    </div>
  );
};

export default ContentManager;