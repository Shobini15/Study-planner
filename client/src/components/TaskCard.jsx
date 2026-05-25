import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const TaskCard = ({ task, onToggle, onEdit, onDelete }) => {
  return (
    <motion.div whileHover={{ y: -4 }} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow hover:shadow-lg transition flex items-start gap-4">
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="px-2 py-1 rounded-md bg-indigo-50 text-indigo-600 text-xs">{task.subject || 'General'}</div>
            <h3 className={`font-semibold ${task.status === 'completed' ? 'line-through text-gray-400' : ''}`}>{task.title}</h3>
          </div>
          <div className="text-sm text-gray-500">{task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}</div>
        </div>

        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{task.description}</p>

        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={() => onToggle(task)}
            className={`px-3 py-1 rounded-full text-sm ${task.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}
          >
            {task.status === 'completed' ? 'Completed' : 'Mark done'}
          </button>

          <button onClick={() => onEdit(task)} className="p-2 rounded-md bg-indigo-50 text-indigo-600">
            <Edit2 size={16} />
          </button>
          <button onClick={() => onDelete(task)} className="p-2 rounded-md bg-red-50 text-red-600">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
