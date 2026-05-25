import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Calendar = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/tasks');
        setTasks((res.data || []).filter(t => t.deadline));
      } catch (err) {
        console.warn(err.message);
      }
    };
    load();
  }, []);

  const upcoming = tasks
    .map(t => ({ ...t, date: new Date(t.deadline) }))
    .sort((a, b) => a.date - b.date)
    .slice(0, 12);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Calendar</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold mb-3">Monthly Overview</h3>
          <div className="grid grid-cols-7 gap-2 text-xs text-gray-500">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
              <div key={d} className="text-center font-medium">{d}</div>
            ))}
            {Array.from({length: 28}).map((_,i) => (
              <div key={i} className="h-20 p-2 border rounded-md bg-white/50 dark:bg-gray-700/50 flex flex-col justify-between">
                <div className="text-sm text-gray-600">{i+1}</div>
                <div className="text-xs text-gray-500">{/* events could go here */}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold mb-3">Upcoming Tasks</h3>
          <div className="space-y-3">
            {upcoming.length === 0 && <div className="text-sm text-gray-500">No upcoming deadlines</div>}
            {upcoming.map(t => (
              <div key={t._id} className="p-3 border rounded-md">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{t.title}</div>
                  <div className="text-sm text-gray-500">{t.date.toLocaleDateString()}</div>
                </div>
                <div className="text-xs text-gray-600">{t.subject}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
