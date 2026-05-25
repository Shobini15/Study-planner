import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/signup', { name, email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userName', res.data.name);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Create account</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 rounded-md bg-white dark:bg-gray-700" placeholder="Name" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 rounded-md bg-white dark:bg-gray-700" placeholder="Email" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 rounded-md bg-white dark:bg-gray-700" placeholder="Password" type="password" />
        <button disabled={loading} className="w-full p-3 bg-indigo-600 text-white rounded-md">{loading ? 'Creating...' : 'Create account'}</button>
      </form>
      <div className="mt-4 text-sm text-gray-500">Already have an account? <Link to="/login" className="text-indigo-600">Sign in</Link></div>
    </div>
  );
};

export default Signup;
