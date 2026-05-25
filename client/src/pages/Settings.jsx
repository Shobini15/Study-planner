import React, { useState } from 'react';

const Settings = () => {
  const [name, setName] = useState(localStorage.getItem('userName') || '');
  const [email] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('userName', name);
    alert('Profile saved');
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm max-w-md">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded-md bg-white dark:bg-gray-700" />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Theme</label>
            <div className="mt-2 flex items-center gap-3">
              <button type="button" onClick={() => {document.documentElement.classList.remove('dark');}} className="px-3 py-2 rounded-md bg-gray-100">Light</button>
              <button type="button" onClick={() => {document.documentElement.classList.add('dark');}} className="px-3 py-2 rounded-md bg-gray-800 text-white">Dark</button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600">Change Password</label>
            <input placeholder="New password" type="password" className="w-full px-3 py-2 rounded-md bg-white dark:bg-gray-700 mt-2" />
            <button className="mt-2 px-4 py-2 rounded-md bg-indigo-600 text-white">Change Password</button>
          </div>

          <div className="pt-2">
            <button type="submit" className="px-4 py-2 rounded-md bg-indigo-600 text-white">Save Profile</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
