import React, { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import ProgressCircle from '../components/ProgressCircle';
import TaskCard from '../components/TaskCard';
import { PieChart, BarChart, LineChart } from 'recharts';
import { Book, CheckCircle, Clock } from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
  const [summary, setSummary] = useState({ totalTasks: 0, completedTasks: 0, pendingTasks: 0, completionPercentage: 0 });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/analytics');
        setSummary(res.data.summary || {});
      } catch (err) {
        console.warn('Analytics load failed', err.message);
      }

      try {
        const t = await api.get('/tasks');
        setRecent((t.data || []).slice(0, 4));
      } catch (err) {}
    };
    load();
  }, []);

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard title="Total Tasks" value={summary.totalTasks} icon={<Book size={20} />} />
          <StatCard title="Completed" value={summary.completedTasks} icon={<CheckCircle size={20} />} />
          <StatCard title="Pending" value={summary.pendingTasks} icon={<Clock size={20} />} />
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex items-center justify-center">
            <div className="flex items-center gap-4">
              <ProgressCircle progress={summary.completionPercentage || 0} />
              <div>
                <div className="text-sm text-gray-500">Productivity</div>
                <div className="text-xl font-semibold">{summary.completionPercentage}%</div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-80 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold">Today's Focus</h3>
          <p className="text-sm text-gray-500">Pick a task and focus for 25 minutes.</p>
          <div className="mt-4 space-y-3">
            {recent.length === 0 && <div className="text-sm text-gray-500">No recent tasks</div>}
            {recent.map((t) => (
              <TaskCard key={t._id} task={t} onToggle={() => {}} onEdit={() => {}} onDelete={() => {}} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
