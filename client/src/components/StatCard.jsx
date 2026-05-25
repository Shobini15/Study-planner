import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, delta, icon }) => {
  return (
    <motion.div
      initial={{ y: 8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex items-center gap-4"
    >
      <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600">{icon}</div>
      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-2xl font-semibold">{value}</div>
      </div>
      {delta !== undefined && (
        <div className="ml-auto text-sm text-gray-500">{delta}</div>
      )}
    </motion.div>
  );
};

export default StatCard;
