import React, { useEffect, useState } from 'react';
import api from '../services/api';
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
} from 'recharts';

const COLORS = ['#60A5FA', '#A78BFA', '#34D399', '#F97316'];

const Analytics = () => {
  const [data, setData] = useState({ summary: {}, subjectStats: [], weeklyProductivity: [] });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/analytics');
        setData(res.data || {});
      } catch (err) {
        console.warn(err.message);
      }
    };
    load();
  }, []);

  const pieData = [
    { name: 'Completed', value: data.summary.completedTasks || 0 },
    { name: 'Pending', value: data.summary.pendingTasks || 0 },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold">Overview</h3>
          <div className="mt-3 text-sm text-gray-600">
            <div>Total Tasks: {data.summary.totalTasks || 0}</div>
            <div>Completed: {data.summary.completedTasks || 0}</div>
            <div>Pending: {data.summary.pendingTasks || 0}</div>
            <div>Productivity: {data.summary.completionPercentage || 0}%</div>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold mb-4">Completion Ratio</h3>
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold mb-4">Subject Progress</h3>
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <BarChart data={data.subjectStats || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="#60A5FA" />
                <Bar dataKey="pending" fill="#F97316" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold mb-4">Weekly Productivity</h3>
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <LineChart data={data.weeklyProductivity || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="completedCount" stroke="#8B5CF6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
