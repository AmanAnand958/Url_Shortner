import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Dashboard = () => {
  const [url, setUrl] = useState('');
  const [customSuffix, setCustomSuffix] = useState('');
  const [shortenedUrls, setShortenedUrls] = useState([]);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const response = await api.get('/getallurls');
      setShortenedUrls(response.data.urls || []);
    } catch (err) {
      console.error('Failed to fetch URLs', err);
      // If unauthorized, redirect to login
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/login');
      }
    }
  };

  const handleShorten = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    try {
      const payload = { url };
      if (customSuffix) {
        payload.shortUrlSuffixByUser = customSuffix;
      }
      
      const response = await api.post('/shorten', payload);
      setSuccessMsg(`Short URL created: ${response.data.shortUrl}`);
      setUrl('');
      setCustomSuffix('');
      fetchUrls(); // Refresh list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to shorten URL');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">URL Shortener</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-200"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto mt-10 px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Shorten a new URL</h2>
          {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
          {successMsg && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{successMsg}</div>}
          
          <form onSubmit={handleShorten} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Original URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="https://example.com"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Custom Alias (Optional)</label>
              <input
                type="text"
                value={customSuffix}
                onChange={(e) => setCustomSuffix(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="my-link"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition duration-300"
            >
              Shorten
            </button>
          </form>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-6">Your Shortened URLs</h2>
          {shortenedUrls.length === 0 ? (
            <p className="text-gray-500 text-center">No URLs shortened yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Original URL
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Short Alias
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {shortenedUrls.map((item, index) => (
                    <tr key={index}>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <div className="flex items-center">
                          <div className="ml-3">
                            <p className="text-gray-900 whitespace-no-wrap overflow-hidden max-w-sm truncate">
                              {item.url}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                           {/* Assuming frontend knows the base url, or just showing the suffix */}
                           / {item.shortUrl}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
