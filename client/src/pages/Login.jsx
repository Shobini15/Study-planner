import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userName', res.data.name);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Welcome back</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 rounded-md bg-white dark:bg-gray-700" placeholder="Email" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 rounded-md bg-white dark:bg-gray-700" placeholder="Password" type="password" />
        <button disabled={loading} className="w-full p-3 bg-indigo-600 text-white rounded-md">{loading ? 'Signing in...' : 'Sign in'}</button>
      </form>
      <div className="mt-4 text-sm text-gray-500">Don't have an account? <Link to="/signup" className="text-indigo-600">Sign up</Link></div>
    </div>
  );
};

export default Login;
