import React, { useState } from 'react';
import { notifications as initialNotifications } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';
import { Bell, AlertCircle, AlertTriangle, Info, Filter, Search, Eye, CheckCircle2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Notifications = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [notifs, setNotifs] = useState(initialNotifications || []);

  const getFilteredNotifs = () => {
    let filtered = notifs;
    if (activeTab !== 'All') {
      filtered = filtered.filter(n => n.severity === activeTab);
    }
    if (searchTerm) {
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        n.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  };

  const filteredNotifs = getFilteredNotifs();

  const markAsRead = (id) => {
    setNotifs(notifs.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifs(notifs.map(n => ({ ...n, read: true })));
  };

  const total = notifs.length;
  const unread = notifs.filter(n => !n.read).length;
  const critical = notifs.filter(n => n.severity === 'Critical').length;
  const thisWeek = notifs.length; // Mock implementation

  const getSeverityIcon = (severity) => {
    switch(severity) {
      case 'Critical': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'Warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getSeverityBorder = (severity) => {
    switch(severity) {
      case 'Critical': return 'border-l-4 border-l-red-500';
      case 'Warning': return 'border-l-4 border-l-amber-500';
      default: return 'border-l-4 border-l-blue-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500">Alerts, approvals, and system notifications</p>
        </div>
        <button 
          onClick={markAllAsRead}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
        >
          <CheckCircle2 className="w-4 h-4 mr-1" />
          Mark all as read
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center">
          <div className="p-3 rounded-lg bg-gray-100 mr-4">
            <Bell className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Total</div>
            <div className="text-xl font-bold text-gray-900">{total}</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center">
          <div className="p-3 rounded-lg bg-blue-100 mr-4">
            <Eye className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Unread</div>
            <div className="text-xl font-bold text-gray-900">{unread}</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center">
          <div className="p-3 rounded-lg bg-red-100 mr-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Critical</div>
            <div className="text-xl font-bold text-gray-900">{critical}</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center">
          <div className="p-3 rounded-lg bg-green-100 mr-4">
            <Clock className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500">This Week</div>
            <div className="text-xl font-bold text-gray-900">{thisWeek}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex space-x-1">
            {['All', 'Critical', 'Warning', 'Info'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search notifications..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredNotifs.length > 0 ? (
            filteredNotifs.map((notif) => (
              <div 
                key={notif.id} 
                className={`p-5 flex items-start gap-4 transition-colors hover:bg-gray-50 ${!notif.read ? 'bg-blue-50/30' : 'bg-white'} ${getSeverityBorder(notif.severity)}`}
              >
                <div className="mt-1">
                  {getSeverityIcon(notif.severity)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div>
                      <h4 className={`text-base font-semibold ${!notif.read ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notif.title}
                      </h4>
                      <p className="text-gray-600 mt-1 text-sm">{notif.message}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-gray-500 whitespace-nowrap">{notif.date}</span>
                      <StatusBadge status={notif.category} />
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center gap-4">
                    {notif.caseId && (
                      <Link 
                        to={`/compensation?caseId=${notif.caseId}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        View Case
                      </Link>
                    )}
                    {!notif.read && (
                      <button 
                        onClick={() => markAsRead(notif.id)}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No notifications found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
