import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, ListTodo, BarChart2, Calendar as CalendarIcon, Settings, LogOut, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ onCloseMobile }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/login');
    if (onCloseMobile) onCloseMobile();
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
      isActive ? 'bg-indigo-600 text-white' : 'text-gray-700 dark:text-gray-300'
    }`;

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 bg-white dark:bg-gray-800 shadow-xl md:block h-screen p-6 glass fixed md:relative z-40"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-indigo-600">Study Planner</h2>
          <p className="text-sm text-gray-500">Organize, study, succeed</p>
        </div>
        <button className="md:hidden p-2 rounded-md" onClick={onCloseMobile} aria-label="close sidebar">
          <Menu size={20} />
        </button>
      </div>

      <nav className="flex flex-col gap-2">
        <NavLink to="/" className={linkClass} end onClick={onCloseMobile}>
          <Home size={18} /> Dashboard
        </NavLink>
        <NavLink to="/tasks" className={linkClass} onClick={onCloseMobile}>
          <ListTodo size={18} /> Tasks
        </NavLink>
        <NavLink to="/analytics" className={linkClass} onClick={onCloseMobile}>
          <BarChart2 size={18} /> Analytics
        </NavLink>
        <NavLink to="/calendar" className={linkClass} onClick={onCloseMobile}>
          <CalendarIcon size={18} /> Calendar
        </NavLink>
        <NavLink to="/settings" className={linkClass} onClick={onCloseMobile}>
          <Settings size={18} /> Settings
        </NavLink>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 mt-auto"
        >
          <LogOut size={18} /> Logout
        </button>
      </nav>
    </motion.aside>
  );
};

export default Sidebar;
