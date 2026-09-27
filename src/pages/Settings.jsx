import React, { useState } from 'react';
import { User, Bell, Shield, Globe, Sliders, Save, Camera } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const Settings = () => {
  const context = useOutletContext();
  
  const [showToast, setShowToast] = useState(false);
  
  const [profile, setProfile] = useState({
    name: 'Rajesh Kumar',
    email: 'rajesh.k@bhumidarpan.gov.in',
    phone: '+91 98765 43210',
    district: 'Hyderabad',
  });
  
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    whatsapp: false,
    approvals: true,
    disputes: true,
    systemUpdates: false
  });
  
  const [preferences, setPreferences] = useState({
    language: 'English',
    theme: 'Light',
    dateFormat: 'DD/MM/YYYY',
    refreshInterval: '5'
  });

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="space-y-6 relative">
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center z-50 animate-fade-in-up">
          <Save className="w-5 h-5 mr-2" />
          Settings saved successfully
        </div>
      )}

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500">Manage your profile and preferences</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center font-medium transition-colors"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold">
                {profile.name.charAt(0)}
              </div>
              <button className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow border border-gray-200 text-gray-600 hover:text-blue-600">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
            <p className="text-gray-500 mb-2">District Land Acquisition Officer</p>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">Active</span>
          </div>

          {/* Role & Permissions (Readonly) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center text-gray-800 font-semibold mb-4">
              <Shield className="w-5 h-5 mr-2 text-blue-600" />
              Role & Permissions
            </div>
            <div className="space-y-3">
              <div className="text-sm">
                <span className="block text-gray-500 mb-1">Current Role</span>
                <span className="font-medium text-gray-900">District Land Acquisition Officer</span>
              </div>
              <div>
                <span className="block text-gray-500 text-sm mb-2">Permissions</span>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span> Approve Compensation</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span> View All Analytics</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span> Resolve Disputes</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-2"></span> Manage Users</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Profile Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center text-gray-800 font-semibold mb-4">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Personal Information
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">District Assigned</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500" 
                  value={profile.district}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center text-gray-800 font-semibold mb-4">
              <Bell className="w-5 h-5 mr-2 text-blue-600" />
              Notification Preferences
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900 border-b pb-2">Delivery Channels</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries({
                  email: 'Email Notifications',
                  sms: 'SMS Alerts',
                  whatsapp: 'WhatsApp Alerts'
                }).map(([key, label]) => (
                  <label key={key} className="flex items-center space-x-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      checked={notifications[key]}
                      onChange={(e) => setNotifications({...notifications, [key]: e.target.checked})}
                    />
                    <span className="text-gray-700 text-sm">{label}</span>
                  </label>
                ))}
              </div>
              
              <h4 className="text-sm font-medium text-gray-900 border-b pb-2 pt-2">Notification Types</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries({
                  approvals: 'Approvals & Signatures Required',
                  disputes: 'New Disputes or Hearings',
                  systemUpdates: 'System Maintenance & Updates'
                }).map(([key, label]) => (
                  <label key={key} className="flex items-center space-x-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      checked={notifications[key]}
                      onChange={(e) => setNotifications({...notifications, [key]: e.target.checked})}
                    />
                    <span className="text-gray-700 text-sm">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* System Preferences */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center text-gray-800 font-semibold mb-4">
              <Sliders className="w-5 h-5 mr-2 text-blue-600" />
              System Preferences
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Globe className="w-4 h-4 mr-1" /> Language
                </label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={preferences.language}
                  onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                >
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Telugu</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={preferences.theme}
                  onChange={(e) => setPreferences({...preferences, theme: e.target.value})}
                >
                  <option>Light</option>
                  <option>Dark</option>
                  <option>System Default</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={preferences.dateFormat}
                  onChange={(e) => setPreferences({...preferences, dateFormat: e.target.value})}
                >
                  <option>DD/MM/YYYY</option>
                  <option>MM/DD/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Auto-refresh Data</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={preferences.refreshInterval}
                  onChange={(e) => setPreferences({...preferences, refreshInterval: e.target.value})}
                >
                  <option value="0">Disabled</option>
                  <option value="5">Every 5 minutes</option>
                  <option value="15">Every 15 minutes</option>
                  <option value="30">Every 30 minutes</option>
                </select>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;
