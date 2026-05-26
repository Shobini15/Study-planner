import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, ListTodo, BarChart2, Calendar as CalendarIcon, Settings, LogOut, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ onCloseMobile }) => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Student';

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      // notify app about auth change so it can re-render
      window.dispatchEvent(new Event('authChanged'));
      navigate('/login');
      if (onCloseMobile) onCloseMobile();
    }
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${
      isActive
        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
    }`;

  const sidebarVariants = {
    hidden: { x: -300, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.aside
      initial="hidden"
      animate="visible"
      variants={sidebarVariants}
      className="w-64 bg-white dark:bg-gray-800 shadow-2xl md:shadow-sm md:block h-screen p-6 fixed md:relative z-40 flex flex-col border-r border-gray-200 dark:border-gray-700 overflow-y-auto"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-lg font-bold">
              📚
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              StudyHub
            </h2>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Your Learning Companion</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={onCloseMobile}
          aria-label="close sidebar"
        >
          <X size={20} />
        </motion.button>
      </motion.div>

      {/* User Profile Card */}
      <motion.div
        variants={itemVariants}
        className="mb-6 p-4 rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
            {(userName || 'S')[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{userName}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Premium Member</p>
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.nav
        className="flex-1 flex flex-col gap-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <NavLink to="/" className={linkClass} end onClick={onCloseMobile}>
            <Home size={20} />
            <span>Dashboard</span>
          </NavLink>
        </motion.div>

        <motion.div variants={itemVariants}>
          <NavLink to="/tasks" className={linkClass} onClick={onCloseMobile}>
            <ListTodo size={20} />
            <span>Tasks</span>
          </NavLink>
        </motion.div>

        <motion.div variants={itemVariants}>
          <NavLink to="/analytics" className={linkClass} onClick={onCloseMobile}>
            <BarChart2 size={20} />
            <span>Analytics</span>
          </NavLink>
        </motion.div>

        <motion.div variants={itemVariants}>
          <NavLink to="/calendar" className={linkClass} onClick={onCloseMobile}>
            <CalendarIcon size={20} />
            <span>Calendar</span>
          </NavLink>
        </motion.div>

        <motion.div variants={itemVariants}>
          <NavLink to="/settings" className={linkClass} onClick={onCloseMobile}>
            <Settings size={20} />
            <span>Settings</span>
          </NavLink>
        </motion.div>
      </motion.nav>

      {/* Divider */}
      <motion.div variants={itemVariants} className="my-4 h-px bg-gray-200 dark:bg-gray-700" />

      {/* Footer */}
      <motion.div variants={itemVariants} className="space-y-2">
        <motion.button
          whileHover={{ scale: 1.02, x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </motion.button>

        <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-2">
          v1.0.0 • All rights reserved
        </p>
      </motion.div>
    </motion.aside>
  );
};

export default Sidebar;
