import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { TrendingUp, BookOpen, CheckCircle2, Clock, Target } from 'lucide-react';
import api from '../services/api';

const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F97316'];
const COLORS_LIGHT = ['#60A5FA', '#A78BFA', '#34D399', '#F97316'];

const Analytics = () => {
  const [data, setData] = useState({
    summary: { totalTasks: 0, completedTasks: 0, pendingTasks: 0, completionPercentage: 0 },
    subjectStats: [],
    weeklyProductivity: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/analytics');
        setData(res.data || {});
      } catch (err) {
        console.warn(err.message);
        toast.error('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const pieData = [
    { name: 'Completed', value: data.summary.completedTasks || 0, color: '#10B981' },
    { name: 'Pending', value: data.summary.pendingTasks || 0, color: '#F59E0B' },
  ];

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

  const chartProps = {
    margin: { top: 5, right: 30, left: 0, bottom: 5 },
  };

  const renderCustomTooltip = (props) => {
    const { active, payload } = props;
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 text-white p-3 rounded-lg text-sm border border-gray-700">
          <p className="font-medium">{payload[0].payload.name || payload[0].payload.subject || payload[0].payload.day}</p>
          <p className="text-indigo-400">{payload[0].name}: {payload[0].value}</p>
        </div>
      );
    }
    return null;
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
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Track your study progress and productivity trends</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <BookOpen size={24} className="opacity-80" />
            <span className="text-3xl font-bold">{data.summary.totalTasks}</span>
          </div>
          <p className="text-indigo-100 text-sm font-medium">Total Tasks</p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle2 size={24} className="opacity-80" />
            <span className="text-3xl font-bold">{data.summary.completedTasks}</span>
          </div>
          <p className="text-green-100 text-sm font-medium">Completed</p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Clock size={24} className="opacity-80" />
            <span className="text-3xl font-bold">{data.summary.pendingTasks}</span>
          </div>
          <p className="text-orange-100 text-sm font-medium">Pending</p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp size={24} className="opacity-80" />
            <span className="text-3xl font-bold">{data.summary.completionPercentage}%</span>
          </div>
          <p className="text-purple-100 text-sm font-medium">Productivity</p>
        </motion.div>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Target size={20} />
            Task Completion Ratio
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#FFF',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Weekly Productivity Line Chart */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <TrendingUp size={20} />
            Weekly Productivity
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={
                data.weeklyProductivity && data.weeklyProductivity.length > 0
                  ? data.weeklyProductivity
                  : [
                    { day: 'Mon', completedCount: 0 },
                    { day: 'Tue', completedCount: 0 },
                    { day: 'Wed', completedCount: 0 },
                    { day: 'Thu', completedCount: 0 },
                    { day: 'Fri', completedCount: 0 },
                    { day: 'Sat', completedCount: 0 },
                    { day: 'Sun', completedCount: 0 },
                  ]
              }
              {...chartProps}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip content={renderCustomTooltip} />
              <Legend />
              <Line
                type="monotone"
                dataKey="completedCount"
                stroke="#8B5CF6"
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', r: 5 }}
                activeDot={{ r: 7 }}
                name="Tasks Completed"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Subject Progress Bar Chart */}
      {data.subjectStats && data.subjectStats.length > 0 && (
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <BookOpen size={20} />
            Subject-wise Progress
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.subjectStats} {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="subject" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip content={renderCustomTooltip} />
              <Legend />
              <Bar dataKey="completed" stackId="a" fill="#10B981" name="Completed" />
              <Bar dataKey="pending" stackId="a" fill="#F59E0B" name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Insights Cards */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 rounded-xl p-6 border border-blue-200 dark:border-blue-800"
        >
          <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">Completion Rate</h3>
          <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
            {data.summary.totalTasks > 0
              ? Math.round((data.summary.completedTasks / data.summary.totalTasks) * 100)
              : 0}%
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">of all tasks completed</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 rounded-xl p-6 border border-green-200 dark:border-green-800"
        >
          <h3 className="text-sm font-semibold text-green-900 dark:text-green-100 mb-2">Streak</h3>
          <p className="text-3xl font-bold text-green-700 dark:text-green-300">5</p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-2">days of consistency</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 rounded-xl p-6 border border-purple-200 dark:border-purple-800"
        >
          <h3 className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-2">Average</h3>
          <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
            {data.weeklyProductivity && data.weeklyProductivity.length > 0
              ? Math.round(data.weeklyProductivity.reduce((sum, w) => sum + (w.completedCount || 0), 0) / data.weeklyProductivity.length)
              : 0}
          </p>
          <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">tasks per day</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
export default Analytics;
