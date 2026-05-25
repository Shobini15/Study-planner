import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const TaskModal = ({ open, onClose, onSave, task }) => {
  const [form, setForm] = useState({ title: '', description: '', subject: '', priority: '3', deadline: '', status: 'pending' });

  useEffect(() => {
    if (task) setForm({ title: task.title || '', description: task.description || '', subject: task.subject || '', priority: task.priority || '3', deadline: task.deadline ? new Date(task.deadline).toISOString().slice(0,16) : '', status: task.status || 'pending' });
    else setForm({ title: '', description: '', subject: '', priority: '3', deadline: '', status: 'pending' });
  }, [task]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{task? 'Edit Task' : 'Create Task'}</h3>
          <button onClick={onClose} className="p-2 rounded-md"><X /></button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-3">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="w-full p-3 rounded-md bg-gray-50 dark:bg-gray-700" required />
          <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Subject" className="w-full p-3 rounded-md bg-gray-50 dark:bg-gray-700" />
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="w-full p-3 rounded-md bg-gray-50 dark:bg-gray-700" rows={4} />

          <div className="grid grid-cols-2 gap-3">
            <input type="datetime-local" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className="p-2 rounded-md bg-gray-50 dark:bg-gray-700" />
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="p-2 rounded-md bg-gray-50 dark:bg-gray-700">
              <option value="1">High</option>
              <option value="2">Medium</option>
              <option value="3">Low</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-md bg-indigo-600 text-white">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
