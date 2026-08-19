import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Filter, Search, SortAsc, ChevronDown } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../services/api';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [query, setQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('deadline');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);

  const logApiError = (action, err) => {
    const status = err.response?.status;
    const backendMessage = err.response?.data?.message || err.message || 'Unknown error';
    console.error(`[Task API] ${action} failed`, {
      status,
      url: err.config?.url,
      method: err.config?.method,
      backendMessage,
      responseData: err.response?.data,
    });
    return `${action} failed: ${backendMessage}${status ? ` (HTTP ${status})` : ''}`;
  };

  const load = async () => {
    try {
      // Cache-busting: add timestamp to force fresh data
      const timestamp = new Date().getTime();
      const res = await api.get(`/tasks?t=${timestamp}`);
      setTasks(res.data || []);
      console.log('[Tasks] Loaded', (res.data || []).length, 'tasks');
    } catch (err) {
      console.error('[Tasks] Load error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const broadcastTaskUpdate = () => {
    const timestamp = new Date().toISOString();
    const updateEvent = new CustomEvent('taskUpdated', {
      detail: { updatedAt: timestamp },
    });
    window.dispatchEvent(updateEvent);
    localStorage.setItem('taskUpdatedAt', timestamp);
    console.log('[Tasks] Broadcasting update at', timestamp);
  };

  const handleToggle = async (task) => {
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      console.log(`[Tasks] Toggling task ${task._id} status to ${newStatus}`);
      const response = await api.put(`/tasks/${task._id}`, { ...task, status: newStatus });
      const updatedTask = response.data;
      if (newStatus === 'completed') {
        toast.success('Task completed! 🎉');
      } else {
        toast.info('Task marked as pending');
      }
      setTasks((prevTasks) => prevTasks.map((t) => (t._id === task._id ? updatedTask : t)));
      console.log('[Tasks] Task toggled, broadcasting update');
      broadcastTaskUpdate();
    } catch (err) {
      const errorMsg = logApiError('Toggle task status', err);
      toast.error(errorMsg);
    }
  };

  const handleDelete = async (task) => {
    if (!window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) return;
    try {
      console.log(`[Tasks] Deleting task ${task._id}`);
      await api.delete(`/tasks/${task._id}`);
      setTasks((prevTasks) => prevTasks.filter((t) => t._id !== task._id));
      toast.success('Task deleted successfully 🗑️');
      console.log('[Tasks] Task deleted, broadcasting update');
      broadcastTaskUpdate();
    } catch (err) {
      const errorMsg = logApiError('Delete task', err);
      toast.error(errorMsg);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleSave = async (form) => {
    try {
      if (editingTask && editingTask._id) {
        console.log(`[Tasks] Updating task ${editingTask._id}`);
        const response = await api.put(`/tasks/${editingTask._id}`, { ...editingTask, ...form });
        const updatedTask = response.data;
        setTasks((prevTasks) => prevTasks.map((t) => (t._id === updatedTask._id ? updatedTask : t)));
        toast.success('Task updated successfully! ✅');
      } else {
        console.log('[Tasks] Creating new task');
        const response = await api.post('/tasks', form);
        const newTask = response.data;
        setTasks((prevTasks) => [newTask, ...prevTasks]);
        toast.success('Task created successfully! ✨');
      }
      setModalOpen(false);
      console.log('[Tasks] Task saved, broadcasting update');
      broadcastTaskUpdate();
    } catch (err) {
      const errorMsg = logApiError('Save task', err);
      toast.error(errorMsg);
    }
  };

  const priorityLabels = { 1: 'High', 2: 'Medium', 3: 'Low' };

  const subjects = useMemo(
    () => Array.from(new Set(tasks.map((t) => t.subject).filter(Boolean))),
    [tasks]
  );

  const filtered = useMemo(
    () =>
      tasks
        .filter((t) => (subjectFilter === 'all' ? true : t.subject === subjectFilter))
        .filter((t) => (statusFilter === 'all' ? true : t.status === statusFilter))
        .filter(
          (t) =>
            t.title.toLowerCase().includes(query.toLowerCase()) ||
            (t.description || '').toLowerCase().includes(query.toLowerCase())
        )
        .sort((a, b) => {
          if (sortBy === 'deadline') return new Date(a.deadline || 0) - new Date(b.deadline || 0);
          if (sortBy === 'priority') return (a.priority || 3) - (b.priority || 3);
          if (sortBy === 'title') return a.title.localeCompare(b.title);
          return 0;
        }),
    [tasks, query, subjectFilter, statusFilter, sortBy]
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    pending: tasks.filter((t) => t.status === 'pending').length,
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="md:flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tasks</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Organize and track all your study tasks</p>
        </div>
        <button
          onClick={handleCreate}
          className="mt-4 md:mt-0 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition flex items-center gap-2 font-medium shadow-lg hover:shadow-xl"
        >
          <Plus size={20} />
          New Task
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-3 gap-4"
      >
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total</p>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <p className="text-sm text-green-600 dark:text-green-400 font-medium">Completed</p>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.completed}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/10 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
          <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Pending</p>
          <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{stats.pending}</p>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Subject Filter */}
          <div className="relative">
            <Filter size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="w-full pl-10 pr-8 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition appearance-none cursor-pointer"
            >
              <option value="all">All subjects</option>
              {subjects.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition appearance-none cursor-pointer"
            >
              <option value="all">All status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Sort */}
          <div className="relative">
            <SortAsc size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-10 pr-8 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition appearance-none cursor-pointer"
            >
              <option value="deadline">Deadline</option>
              <option value="priority">Priority</option>
              <option value="title">Title</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </motion.div>

      {/* Tasks List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        {loading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto"
          />
        ) : filtered.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="text-center py-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No tasks found</h3>
            <p className="text-gray-500 dark:text-gray-400">Create a new task to get started</p>
          </motion.div>
        ) : (
          filtered.map((t, index) => (
            <motion.div key={t._id} variants={itemVariants}>
              <TaskCard
                task={t}
                onToggle={handleToggle}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Modal */}
      <TaskModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} task={editingTask} />
    </motion.div>
  );
};

export default Tasks;
