import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Bell,
  MapPin,
  Plus,
  Menu,
  User,
  ChevronDown,
  X,
} from 'lucide-react'
import { notifications as allNotifications } from '../data/mockData.js'

export default function TopNavbar({ onMenuToggle, addToast }) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [newCaseOpen, setNewCaseOpen] = useState(false)
  const navigate = useNavigate()
  const notifRef = useRef(null)
  const profileRef = useRef(null)

  const unreadCount = allNotifications.filter((n) => !n.read).length

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <>
      <header className="flex items-center justify-between gap-4 h-16 px-4 md:px-6 bg-white border-b border-gray-200 shrink-0">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button onClick={onMenuToggle} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          {/* Search */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects, parcels, cases..."
              className="w-72 lg:w-96 pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button onClick={() => setSearchOpen(!searchOpen)} className="sm:hidden p-2 rounded-lg hover:bg-gray-100">
            <Search className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* District */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 bg-gray-50 rounded-lg border border-gray-200">
            <MapPin className="w-3.5 h-3.5" />
            <span>Guntur District</span>
          </div>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false) }}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 animate-scale-in">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                  <button onClick={() => navigate('/notifications')} className="text-xs text-blue-600 hover:underline">View all</button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {allNotifications.slice(0, 5).map((n) => (
                    <div key={n.id} className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${!n.read ? 'bg-blue-50/50' : ''}`}>
                      <div className="flex items-start gap-2">
                        <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                          n.severity === 'critical' ? 'bg-red-500' :
                          n.severity === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                        }`} />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{n.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                          <p className="text-[10px] text-gray-400 mt-1">{n.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* New Acquisition Case */}
          <button
            onClick={() => setNewCaseOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Acquisition Case</span>
          </button>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false) }}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-navy-700 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-50 animate-scale-in">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">DLAO Officer</p>
                  <p className="text-xs text-gray-500">District Land Acquisition Officer</p>
                  <p className="text-xs text-gray-400">Guntur District, AP</p>
                </div>
                <div className="py-1">
                  <button onClick={() => { navigate('/settings'); setProfileOpen(false) }} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">Profile Settings</button>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">Help & Support</button>
                  <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">Sign Out</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile search */}
      {searchOpen && (
        <div className="sm:hidden px-4 py-2 bg-white border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* New Acquisition Case Modal */}
      {newCaseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 animate-scale-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">New Acquisition Case</h2>
              <button onClick={() => setNewCaseOpen(false)} className="p-1 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                <input type="text" placeholder="Enter project name" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Acquiring Authority</label>
                <input type="text" placeholder="Enter authority name" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                  <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Select district</option>
                    <option>Guntur</option>
                    <option>Krishna</option>
                    <option>Visakhapatnam</option>
                    <option>Prakasam</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Land (acres)</label>
                  <input type="number" placeholder="0.00" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purpose / Description</label>
                <textarea rows="3" placeholder="Describe the purpose of land acquisition..." className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button onClick={() => setNewCaseOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={() => {
                  setNewCaseOpen(false)
                  addToast('New acquisition case created successfully', 'success')
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm"
              >
                Create Case
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
