import React, { useEffect, useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TaskModal = ({ open, onClose, onSave, task }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    subject: '',
    priority: '2',
    deadline: '',
    status: 'pending',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        subject: task.subject || '',
        priority: task.priority || '2',
        deadline: task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : '',
        status: task.status || 'pending',
      });
    } else {
      setForm({
        title: '',
        description: '',
        subject: '',
        priority: '2',
        deadline: '',
        status: 'pending',
      });
    }
    setErrors({});
  }, [task, open]);

  const validateForm = () => {
    const newErrors = {};
    if (!form.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (form.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    if (!form.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    if (!form.deadline) {
      newErrors.deadline = 'Deadline is required';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSave(form);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {task ? '✏️ Edit Task' : '➕ Create Task'}
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  <X size={24} />
                </motion.button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Task Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form.title}
                    onChange={(e) => {
                      setForm({ ...form, title: e.target.value });
                      if (errors.title) setErrors({ ...errors, title: '' });
                    }}
                    placeholder="Enter task title"
                    className={`w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border-2 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none transition ${
                      errors.title
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-200 dark:border-gray-600 focus:border-indigo-500'
                    }`}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={16} /> {errors.title}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Add task details..."
                    className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition resize-none"
                    rows={3}
                  />
                </div>

                {/* Subject & Priority */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Subject
                    </label>
                    <input
                      value={form.subject}
                      onChange={(e) => {
                        setForm({ ...form, subject: e.target.value });
                        if (errors.subject) setErrors({ ...errors, subject: '' });
                      }}
                      placeholder="e.g., Mathematics"
                      className={`w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border-2 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none transition ${
                        errors.subject
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-200 dark:border-gray-600 focus:border-indigo-500'
                      }`}
                    />
                    {errors.subject && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={16} /> {errors.subject}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={form.priority}
                      onChange={(e) => setForm({ ...form, priority: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 transition cursor-pointer"
                    >
                      <option value="1">🔴 High</option>
                      <option value="2">🟡 Medium</option>
                      <option value="3">🟢 Low</option>
                    </select>
                  </div>
                </div>

                {/* Deadline & Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Deadline
                    </label>
                    <input
                      type="datetime-local"
                      value={form.deadline}
                      onChange={(e) => {
                        setForm({ ...form, deadline: e.target.value });
                        if (errors.deadline) setErrors({ ...errors, deadline: '' });
                      }}
                      className={`w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border-2 text-gray-900 dark:text-white focus:outline-none transition ${
                        errors.deadline
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-200 dark:border-gray-600 focus:border-indigo-500'
                      }`}
                    />
                    {errors.deadline && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={16} /> {errors.deadline}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 transition cursor-pointer"
                    >
                      <option value="pending">⏳ Pending</option>
                      <option value="completed">✅ Completed</option>
                    </select>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition font-medium"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition font-medium shadow-lg"
                  >
                    {task ? '💾 Update Task' : '➕ Create Task'}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TaskModal;
