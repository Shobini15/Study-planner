import React, { useEffect, useState } from 'react';
import api from '../services/api';
import TaskCard from '../components/TaskCard';
import SearchBar from '../components/SearchBar';
import TaskModal from '../components/TaskModal';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [query, setQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [sortBy, setSortBy] = useState('deadline');

  const load = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data || []);
    } catch (err) {
      console.warn(err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const handleToggle = async (task) => {
    try {
      const updated = { ...task, status: task.status === 'completed' ? 'pending' : 'completed' };
      await api.put(`/tasks/${task._id}`, updated);
      load();
    } catch (err) {}
  };

  const handleDelete = async (task) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${task._id}`);
      load();
    } catch (err) {}
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
        await api.put(`/tasks/${editingTask._id}`, { ...editingTask, ...form });
      } else {
        await api.post('/tasks', form);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed');
    }
  };

  const subjects = Array.from(new Set(tasks.map((t) => t.subject).filter(Boolean)));

  const filtered = tasks
    .filter((t) => (subjectFilter === 'all' ? true : t.subject === subjectFilter))
    .filter((t) => t.title.toLowerCase().includes(query.toLowerCase()) || (t.description || '').toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'deadline') return new Date(a.deadline || 0) - new Date(b.deadline || 0);
      if (sortBy === 'priority') return (a.priority || 0) - (b.priority || 0);
      return 0;
    });

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <div className="flex items-center gap-3">
          <button onClick={handleCreate} className="px-3 py-2 rounded-md bg-indigo-600 text-white">New Task</button>
          <SearchBar value={query} onChange={setQuery} />
          <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="px-3 py-2 rounded-md bg-white dark:bg-gray-800">
            <option value="all">All subjects</option>
            {subjects.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2 rounded-md bg-white dark:bg-gray-800">
            <option value="deadline">Sort by deadline</option>
            <option value="priority">Sort by priority</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.map((t) => (
          <TaskCard key={t._id} task={t} onToggle={handleToggle} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
        {filtered.length === 0 && <div className="text-gray-500">No tasks found.</div>}
      </div>

      <TaskModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} task={editingTask} />
    </div>
  );
};

export default Tasks;
