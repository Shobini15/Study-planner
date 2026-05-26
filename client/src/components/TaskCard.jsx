import React from 'react';
import { Edit2, Trash2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const TaskCard = ({ task, onToggle, onEdit, onDelete }) => {
  const priorityColors = {
    1: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', label: 'High' },
    2: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-300', label: 'Medium' },
    3: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', label: 'Low' },
  };

  const priority = priorityColors[task.priority] || priorityColors[3];
  const isCompleted = task.status === 'completed';
  const deadline = task.deadline ? new Date(task.deadline) : null;
  const isOverdue = deadline && deadline < new Date() && !isCompleted;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm hover:shadow-lg transition border ${
        isCompleted ? 'border-gray-200 dark:border-gray-700 opacity-75' : 'border-gray-200 dark:border-gray-700'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(task)}
          className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
            isCompleted
              ? 'bg-green-500 border-green-500'
              : 'border-gray-300 dark:border-gray-600 hover:border-indigo-500'
          }`}
        >
          {isCompleted && <CheckCircle2 size={16} className="text-white" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              <h3
                className={`font-semibold text-gray-900 dark:text-white break-words ${
                  isCompleted ? 'line-through text-gray-500 dark:text-gray-400' : ''
                }`}
              >
                {task.title}
              </h3>
            </div>
          </div>

          {/* Badges and Meta */}
          <div className="flex items-center flex-wrap gap-2 mb-3">
            {/* Subject Badge */}
            {task.subject && (
              <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium">
                {task.subject}
              </span>
            )}

            {/* Priority Badge */}
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${priority.bg} ${priority.text}`}>
              {priority.label}
            </span>

            {/* Status Badge */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                isCompleted
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
              }`}
            >
              {isCompleted ? '✓ Done' : 'Pending'}
            </span>

            {/* Overdue Badge */}
            {isOverdue && (
              <span className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-medium">
                Overdue
              </span>
            )}
          </div>

          {/* Description */}
          {task.description && (
            <p className={`text-sm mb-3 ${isCompleted ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'}`}>
              {task.description}
            </p>
          )}

          {/* Deadline */}
          {deadline && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              📅 {deadline.toLocaleDateString()} at {deadline.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit(task)}
            className="p-2 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition"
            title="Edit task"
          >
            <Edit2 size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete(task)}
            className="p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
            title="Delete task"
          >
            <Trash2 size={18} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
