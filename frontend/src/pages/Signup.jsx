import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/user/signup', { name, email, password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-500">
      <div className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md border border-white/30">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Create Account</h2>
        {error && <p className="text-red-300 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="Enter your name"
              required
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="Create a password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-white text-indigo-600 font-bold rounded-lg hover:bg-opacity-90 transition duration-300 shadow-lg"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-6 text-center text-white/80">
          Already have an account? <Link to="/login" className="text-white font-semibold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
