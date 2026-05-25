import React from 'react';

const ProgressCircle = ({ size = 80, stroke = 8, progress = 0 }) => {
  const radius = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="block">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      <circle cx={cx} cy={cy} r={radius} stroke="#E6E9F8" strokeWidth={stroke} fill="none" />
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        stroke="url(#grad)"
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${cx} ${cy})`}
      />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="text-sm font-semibold fill-current text-indigo-600">
        {progress}%
      </text>
    </svg>
  );
};

export default ProgressCircle;
