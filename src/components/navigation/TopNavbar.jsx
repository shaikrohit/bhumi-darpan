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
  Building2,
  FileText,
  CheckCircle2,
  FolderKanban,
  Map,
  ArrowRight
} from 'lucide-react'
import { notifications as allNotifications, districts } from '../../data/mockData.js'
import { searchGlobal } from '../../services/mockService.js'

export default function TopNavbar({ onMenuToggle, addToast }) {
  const navigate = useNavigate()
  const [selectedDistrict, setSelectedDistrict] = useState('Guntur District')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  // Dropdown states
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [districtOpen, setDistrictOpen] = useState(false)

  // New Case Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [newCaseData, setNewCaseData] = useState({
    projectName: '',
    district: 'Guntur',
    authority: 'NHAI',
    totalLand: '',
    parcelsCount: '',
  })

  // Refs for click outside
  const searchRef = useRef(null)
  const notifRef = useRef(null)
  const profileRef = useRef(null)
  const districtRef = useRef(null)

  const unreadCount = allNotifications.filter((n) => !n.read).length

  // Live global search effect
  useEffect(() => {
    let isMounted = true
    if (searchQuery.trim().length > 1) {
      searchGlobal(searchQuery).then((res) => {
        if (isMounted) {
          setSearchResults(res)
          setSearchOpen(true)
        }
      })
    } else {
      setSearchResults([])
      setSearchOpen(false)
    }
    return () => { isMounted = false }
  }, [searchQuery])

  // Handle outside clicks
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false)
      }
      if (districtRef.current && !districtRef.current.contains(event.target)) {
        setDistrictOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle Escape key for modal & search
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        if (modalOpen) setModalOpen(false)
        if (searchOpen) setSearchOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [modalOpen, searchOpen])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/projects?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setMobileSearchOpen(false)
    }
  }

  const handleResultClick = (link) => {
    setSearchOpen(false)
    setMobileSearchOpen(false)
    setSearchQuery('')
    navigate(link)
  }

  const handleCreateCase = (e) => {
    e.preventDefault()
    if (!newCaseData.projectName.trim()) return

    if (addToast) {
      addToast(`Acquisition case "${newCaseData.projectName}" created successfully!`, 'success')
    }
    setModalOpen(false)
    setNewCaseData({
      projectName: '',
      district: 'Guntur',
      authority: 'NHAI',
      totalLand: '',
      parcelsCount: '',
    })
    navigate('/projects')
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6 shadow-2xs">
      {/* Left side: Hamburger & Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          type="button"
          onClick={onMenuToggle}
          aria-label="Toggle Navigation Menu"
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* Global Search Bar (Desktop) */}
        <div className="relative hidden sm:flex flex-1 items-center" ref={searchRef}>
          <form onSubmit={handleSearchSubmit} className="w-full relative flex items-center">
            <label htmlFor="global-search" className="sr-only">
              Search projects, land parcels, survey numbers, cases
            </label>
            <Search className="absolute left-3 h-4 w-4 text-gray-400 pointer-events-none" aria-hidden="true" />
            <input
              id="global-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => { if (searchResults.length > 0) setSearchOpen(true) }}
              placeholder="Search projects (BD-P-001), parcels (BD-PARCEL-001)..."
              className="w-full rounded-lg border border-gray-300 bg-gray-50 py-1.5 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors"
            />
          </form>

          {/* Search Live Results Overlay */}
          {searchOpen && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-gray-200 bg-white shadow-xl z-50 overflow-hidden animate-scale-in">
              <div className="px-3 py-1.5 border-b bg-gray-50 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Matching System Records
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                {searchResults.map((res) => (
                  <button
                    key={res.id + res.link}
                    type="button"
                    onClick={() => handleResultClick(res.link)}
                    className="w-full p-3 text-left hover:bg-blue-50/50 flex items-start gap-3 transition-colors cursor-pointer group"
                  >
                    <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-blue-100 text-gray-600 group-hover:text-blue-600 shrink-0">
                      {res.category === 'Project' ? (
                        <FolderKanban className="w-4 h-4" />
                      ) : res.category === 'Land Parcel' ? (
                        <Map className="w-4 h-4" />
                      ) : (
                        <FileText className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900 group-hover:text-blue-600 truncate">{res.title}</span>
                        <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-xs shrink-0">{res.category}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 truncate mt-0.5">{res.subtitle}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right side: Actions & User menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Search Button */}
        <button
          type="button"
          onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
          aria-label="Search"
          className="sm:hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
        >
          <Search className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* District Selector Pill */}
        <div className="relative" ref={districtRef}>
          <button
            type="button"
            onClick={() => setDistrictOpen(!districtOpen)}
            aria-expanded={districtOpen}
            aria-label={`Current District: ${selectedDistrict}`}
            className="hidden md:flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
          >
            <MapPin className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
            <span>{selectedDistrict}</span>
            <ChevronDown className="h-3 w-3 text-gray-400" aria-hidden="true" />
          </button>

          {districtOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-200 bg-white py-1.5 shadow-lg z-30 animate-scale-in">
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100">
                Select District
              </div>
              <div className="max-h-48 overflow-y-auto py-1">
                {districts.filter(d => d !== 'All Districts').map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      setSelectedDistrict(`${d} District`)
                      setDistrictOpen(false)
                    }}
                    className={`w-full px-3 py-1.5 text-left text-xs font-medium hover:bg-blue-50 hover:text-blue-700 flex items-center justify-between ${
                      selectedDistrict.includes(d) ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700'
                    }`}
                  >
                    <span>{d}</span>
                    {selectedDistrict.includes(d) && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* New Acquisition Case Button */}
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">New Acquisition Case</span>
          <span className="sm:hidden">New Case</span>
        </button>

        {/* Notifications Icon & Popover */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotifOpen(!notifOpen)}
            aria-expanded={notifOpen}
            aria-label={`Notifications (${unreadCount} unread)`}
            className="relative rounded-lg p-2 text-gray-600 hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
          >
            <Bell className="h-5 w-5" aria-hidden="true" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-gray-200 bg-white shadow-xl z-30 animate-scale-in overflow-hidden">
              <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setNotifOpen(false)
                    navigate('/notifications')
                  }}
                  className="text-xs font-medium text-blue-600 hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                {allNotifications.slice(0, 5).map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => {
                      setNotifOpen(false)
                      navigate('/notifications')
                    }}
                    className={`w-full p-3.5 text-left hover:bg-gray-50 transition-colors flex items-start gap-3 cursor-pointer ${
                      !n.read ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    <span className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${
                      n.severity === 'critical' ? 'bg-red-500' : n.severity === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 truncate">{n.title}</p>
                      <p className="text-xs text-gray-600 line-clamp-2 mt-0.5">{n.message}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{n.timestamp}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            aria-expanded={profileOpen}
            aria-label="User Profile Menu"
            className="flex items-center gap-2 rounded-full p-1 hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-700 text-white font-bold text-xs shadow-xs">
              DL
            </div>
            <ChevronDown className="hidden sm:block h-3.5 w-3.5 text-gray-500" aria-hidden="true" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white py-1.5 shadow-xl z-30 animate-scale-in">
              <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50/50">
                <p className="text-xs font-bold text-gray-900">DLAO Officer</p>
                <p className="text-[11px] text-gray-500 truncate">District Land Acquisition Officer</p>
                <p className="text-[10px] font-semibold text-blue-600 mt-0.5">{selectedDistrict}</p>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false)
                    navigate('/settings')
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <User className="h-3.5 w-3.5 text-gray-400" />
                  <span>Profile Settings</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false)
                    navigate('/settings')
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Building2 className="h-3.5 w-3.5 text-gray-400" />
                  <span>District Preferences</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Overlay Input */}
      {mobileSearchOpen && (
        <form
          onSubmit={handleSearchSubmit}
          className="absolute inset-x-0 top-0 z-30 flex h-16 items-center bg-white px-4 shadow-md sm:hidden animate-fade-in"
        >
          <Search className="h-4 w-4 text-gray-400 mr-2" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, land parcels..."
            autoFocus
            className="flex-1 border-none bg-transparent py-2 text-sm text-gray-900 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setMobileSearchOpen(false)}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </form>
      )}

      {/* New Acquisition Case Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-scale-in"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <h2 id="modal-title" className="text-lg font-bold text-gray-900">
                  New Acquisition Case
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Close dialog"
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="mt-4 space-y-4">
              <div>
                <label htmlFor="projectName" className="block text-xs font-semibold text-gray-700 mb-1">
                  Project Name *
                </label>
                <input
                  id="projectName"
                  type="text"
                  required
                  placeholder="e.g. NH-16 Expansion Phase 3"
                  value={newCaseData.projectName}
                  onChange={(e) => setNewCaseData({ ...newCaseData, projectName: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="districtSelect" className="block text-xs font-semibold text-gray-700 mb-1">
                    District
                  </label>
                  <select
                    id="districtSelect"
                    value={newCaseData.district}
                    onChange={(e) => setNewCaseData({ ...newCaseData, district: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    {districts.filter(d => d !== 'All Districts').map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="authoritySelect" className="block text-xs font-semibold text-gray-700 mb-1">
                    Authority
                  </label>
                  <select
                    id="authoritySelect"
                    value={newCaseData.authority}
                    onChange={(e) => setNewCaseData({ ...newCaseData, authority: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="NHAI">NHAI</option>
                    <option value="Irrigation Dept">Irrigation Dept</option>
                    <option value="APIIC">APIIC</option>
                    <option value="Indian Railways">Indian Railways</option>
                    <option value="CRDA">CRDA</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="totalLand" className="block text-xs font-semibold text-gray-700 mb-1">
                    Total Land (Acres)
                  </label>
                  <input
                    id="totalLand"
                    type="number"
                    step="0.1"
                    placeholder="e.g. 120.5"
                    value={newCaseData.totalLand}
                    onChange={(e) => setNewCaseData({ ...newCaseData, totalLand: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="parcelsCount" className="block text-xs font-semibold text-gray-700 mb-1">
                    Affected Parcels
                  </label>
                  <input
                    id="parcelsCount"
                    type="number"
                    placeholder="e.g. 45"
                    value={newCaseData.parcelsCount}
                    onChange={(e) => setNewCaseData({ ...newCaseData, parcelsCount: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs cursor-pointer"
                >
                  Create Acquisition Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  )
}
