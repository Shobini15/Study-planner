// src/components/Navbar.jsx
import React from 'react';
import { Moon, Sun, Search, Bell, Menu } from 'lucide-react';

const Navbar = ({ onOpenMobile }) => {
  const [darkMode, setDarkMode] = React.useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    setDarkMode(!darkMode);
  };

  const userName = localStorage.getItem('userName') || 'User';

  return (
    <header className="flex items-center justify-between bg-transparent p-4">
      <div className="flex items-center gap-3">
        <button className="md:hidden p-2 rounded-md" onClick={onOpenMobile} aria-label="open sidebar">
          <Menu size={20} />
        </button>
        <div className="hidden sm:flex items-center gap-2 bg-white dark:bg-gray-800 border rounded-full px-3 py-2 shadow-sm">
          <Search size={16} className="text-gray-400" />
          <input placeholder="Search tasks, subjects..." className="outline-none text-sm bg-transparent" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm">
          <Bell size={18} />
        </button>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm"
        >
          {darkMode ? <Sun size={18} className="text-yellow-500" /> : <Moon size={18} className="text-gray-800" />}
        </button>

        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold">{(userName || 'U')[0]}</div>
          <div className="hidden sm:block text-sm">
            <div className="font-medium">{userName}</div>
            <div className="text-xs text-gray-500">Member</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
