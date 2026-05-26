import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../services/api';

const Calendar = () => {
  const [tasks, setTasks] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/tasks');
        setTasks((res.data || []).filter((t) => t.deadline));
      } catch (err) {
        console.warn(err.message);
        toast.error('Failed to load calendar events');
      }
    };
    load();
  }, []);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getTasksForDate = (date) => {
    return tasks.filter((t) => {
      const taskDate = new Date(t.deadline);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  const upcoming = tasks
    .map((t) => ({ ...t, date: new Date(t.deadline) }))
    .sort((a, b) => a.date - b.date)
    .slice(0, 10);

  const selectedDateTasks = getTasksForDate(selectedDate);

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

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Calendar</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">View and organize your study deadlines</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">{monthName}</h2>
                <div className="flex gap-2">
                  <button
                    onClick={previousMonth}
                    className="p-2 rounded-lg hover:bg-white/20 transition"
                    title="Previous month"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextMonth}
                    className="p-2 rounded-lg hover:bg-white/20 transition"
                    title="Next month"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-6">
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center text-sm font-semibold text-gray-600 dark:text-gray-400 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Days */}
              <div className="grid grid-cols-7 gap-2">
                {/* Empty days */}
                {emptyDays.map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {/* Calendar days */}
                {daysArray.map((day) => {
                  const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                  const dayTasks = getTasksForDate(date);
                  const isSelected =
                    selectedDate.getDate() === day &&
                    selectedDate.getMonth() === currentDate.getMonth() &&
                    selectedDate.getFullYear() === currentDate.getFullYear();
                  const isToday =
                    new Date().getDate() === day &&
                    new Date().getMonth() === currentDate.getMonth() &&
                    new Date().getFullYear() === currentDate.getFullYear();

                  return (
                    <motion.button
                      key={day}
                      onClick={() => setSelectedDate(date)}
                      whileHover={{ scale: 1.05 }}
                      className={`aspect-square p-2 rounded-lg border-2 transition flex flex-col items-start justify-between text-xs font-medium ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : isToday
                          ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                          : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-300 hover:border-indigo-500'
                      }`}
                    >
                      <span>{day}</span>
                      {dayTasks.length > 0 && (
                        <span className={`${isSelected ? 'bg-white text-indigo-600' : 'bg-indigo-500 text-white'} px-2 py-1 rounded text-xs font-bold`}>
                          {dayTasks.length}
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Date Tasks */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <CalendarIcon size={20} />
              {selectedDate.toLocaleDateString('default', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </h3>

            {selectedDateTasks.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📭</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">No tasks on this day</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDateTasks.map((task) => (
                  <motion.div
                    key={task._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800"
                  >
                    <p className="font-medium text-indigo-900 dark:text-indigo-100 text-sm">{task.title}</p>
                    <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-1">{task.subject}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Upcoming Tasks */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Clock size={20} />
              Upcoming
            </h3>

            {upcoming.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🎉</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">No upcoming deadlines</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcoming.map((task) => {
                  const isOverdue = task.date < new Date() && task.status !== 'completed';
                  return (
                    <motion.div
                      key={task._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-3 rounded-lg border ${
                        isOverdue
                          ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                          : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {isOverdue && <AlertCircle size={16} className="text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />}
                        <div>
                          <p className={`font-medium text-sm ${isOverdue ? 'text-red-900 dark:text-red-100' : 'text-green-900 dark:text-green-100'}`}>
                            {task.title}
                          </p>
                          <p className={`text-xs mt-1 ${isOverdue ? 'text-red-700 dark:text-red-300' : 'text-green-700 dark:text-green-300'}`}>
                            {task.date.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Calendar;
