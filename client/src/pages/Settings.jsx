import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Moon, Sun, Bell, Trash2, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Settings = () => {
  const navigate = useNavigate();
  const [name, setName] = useState(localStorage.getItem('userName') || '');
  const [darkMode, setDarkMode] = useState(document.documentElement.classList.contains('dark'));
  const [notifications, setNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('userName', name);
    setSaved(true);
    toast.success('Settings saved successfully! ✅');
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    setDarkMode(!darkMode);
    toast.info('Theme updated');
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      window.dispatchEvent(new Event('authChanged'));
      toast.success('Logged out successfully');
      navigate('/login');
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      window.dispatchEvent(new Event('authChanged'));
      toast.success('Account deleted');
      navigate('/login');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      className="space-y-6 max-w-3xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account and preferences</p>
      </motion.div>

      {/* Success Message */}
      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-4 rounded-lg bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 text-sm font-medium"
        >
          ✓ Settings saved successfully
        </motion.div>
      )}

      {/* Profile Section */}
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center gap-3 mb-6">
          <User size={24} className="text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Profile Settings</h2>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Enter your name"
              className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <input
              type="email"
              disabled
              placeholder="your@email.com"
              className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white cursor-not-allowed opacity-50"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Email cannot be changed</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-2 px-4 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
          >
            Save Changes
          </motion.button>
        </form>
      </motion.div>

      {/* Preferences Section */}
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center gap-3 mb-6">
          <Moon size={24} className="text-purple-600 dark:text-purple-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Preferences</h2>
        </div>

        <div className="space-y-4">
          {/* Theme */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon size={20} className="text-yellow-500" /> : <Sun size={20} className="text-yellow-500" />}
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {darkMode ? 'Currently enabled' : 'Currently disabled'}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                darkMode
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white hover:bg-gray-300'
              }`}
            >
              {darkMode ? 'Disable' : 'Enable'}
            </motion.button>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-blue-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Notifications</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {notifications ? 'You will receive notifications' : 'Notifications are disabled'}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setNotifications(!notifications)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                notifications
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white hover:bg-gray-300'
              }`}
            >
              {notifications ? 'Disable' : 'Enable'}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Security Section */}
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center gap-3 mb-6">
          <Lock size={24} className="text-red-600 dark:text-red-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Security</h2>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <p className="font-medium text-gray-900 dark:text-white mb-2">Change Password</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Update your password to keep your account secure</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
            >
              Change Password
            </motion.button>
          </div>

          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p className="font-medium text-blue-900 dark:text-blue-100 mb-2">🔐 Two-Factor Authentication</p>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
              Add an extra layer of security to your account
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled
              className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold opacity-50 cursor-not-allowed"
            >
              Coming Soon
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        variants={itemVariants}
        className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800"
      >
        <h2 className="text-xl font-bold text-red-900 dark:text-red-100 mb-4">Danger Zone</h2>

        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full px-4 py-3 rounded-lg bg-orange-600 text-white font-semibold hover:bg-orange-700 transition flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            Logout
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDeleteAccount}
            className="w-full px-4 py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
          >
            <Trash2 size={18} />
            Delete Account
          </motion.button>
        </div>
      </motion.div>

      {/* Footer Note */}
      <motion.div
        variants={itemVariants}
        className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700 text-center"
      >
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Need help? <button type="button" className="text-indigo-600 dark:text-indigo-400 hover:underline focus:outline-none">Contact Support</button>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Settings;
