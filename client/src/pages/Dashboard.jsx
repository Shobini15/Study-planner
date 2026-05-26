import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle2, Clock, TrendingUp, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import StatCard from '../components/StatCard';
import ProgressCircle from '../components/ProgressCircle';
import TaskCard from '../components/TaskCard';
import api from '../services/api';

const Dashboard = () => {
  const [summary, setSummary] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    completionPercentage: 0,
  });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/analytics');
      setSummary(res.data.summary || {});
    } catch (err) {
      console.error('Analytics load failed:', err.message);
      toast.error('Failed to load analytics');
    }

    try {
      const t = await api.get('/tasks');
      setRecent((t.data || []).slice(0, 5));
    } catch (err) {
      console.error('Tasks load failed:', err.message);
      toast.error('Failed to load tasks');
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();

    // Listen for storage changes (task updates from other pages)
    window.addEventListener('storage', loadData);
    // Custom event for task updates
    window.addEventListener('taskUpdated', loadData);

    return () => {
      window.removeEventListener('storage', loadData);
      window.removeEventListener('taskUpdated', loadData);
    };
  }, []);

  const userName = localStorage.getItem('userName') || 'Student';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="md:flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {greeting}, {userName.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Here's your study progress for today
          </p>
        </div>
        <button className="mt-4 md:mt-0 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition flex items-center gap-2 font-medium">
          <Plus size={18} />
          New Task
        </button>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={itemVariants}>
          <StatCard
            title="Total Tasks"
            value={summary.totalTasks}
            icon={<BookOpen size={24} />}
            color="indigo"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Completed"
            value={summary.completedTasks}
            icon={<CheckCircle2 size={24} />}
            color="green"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Pending"
            value={summary.pendingTasks}
            icon={<Clock size={24} />}
            color="orange"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Productivity"
            value={`${summary.completionPercentage}%`}
            icon={<TrendingUp size={24} />}
            color="purple"
          />
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tasks */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Tasks</h2>
              <a href="/tasks" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                View all →
              </a>
            </div>

            {recent.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <BookOpen size={48} className="text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No tasks yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  Create your first task to get started
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recent.map((t, index) => (
                  <motion.div
                    key={t._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <TaskCard task={t} onToggle={() => {}} onEdit={() => {}} onDelete={() => {}} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Productivity Card */}
        <motion.div variants={itemVariants}>
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-6 shadow-lg text-white">
            <h3 className="text-lg font-semibold mb-6">Productivity Overview</h3>

            <div className="flex items-center justify-center mb-6">
              <ProgressCircle progress={summary.completionPercentage || 0} />
            </div>

            <div className="space-y-4">
              <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                <p className="text-white/80 text-sm mb-1">Completion Rate</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{summary.completionPercentage}%</span>
                  <span className="text-sm text-white/70">
                    {summary.completedTasks} of {summary.totalTasks}
                  </span>
                </div>
              </div>

              <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                <p className="text-white/80 text-sm mb-1">Focus Areas</p>
                <p className="text-sm text-white/90">
                  Keep up the momentum! You're doing great.
                </p>
              </div>

              <button className="w-full py-2 px-3 rounded-lg bg-white text-indigo-600 font-semibold hover:bg-white/90 transition text-sm mt-4">
                View Analytics
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">This Week</p>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-2">
            {Math.round((summary.completedTasks / Math.max(summary.totalTasks, 1)) * 100)}%
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">Tasks completed</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 rounded-xl p-4 border border-green-200 dark:border-green-800">
          <p className="text-sm text-green-600 dark:text-green-400 font-medium">Streak</p>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-2">5 days</p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-2">Keep it up!</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
          <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Next Deadline</p>
          <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-2">
            {recent.length > 0 && recent[0].deadline
              ? new Date(recent[0].deadline).toLocaleDateString()
              : 'None'}
          </p>
          <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">Coming up</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
