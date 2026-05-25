import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder = 'Search tasks...' }) => {
  return (
    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border rounded-full px-3 py-2 shadow-sm">
      <Search size={16} className="text-gray-400" />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="outline-none text-sm bg-transparent w-full" />
    </div>
  );
};

export default SearchBar;
