import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  FolderKanban,
  MapPin,
  FileText,
  ShieldCheck,
  Banknote,
  Landmark,
  Bell,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  User,
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/parcels', icon: MapPin, label: 'Land Parcels' },
  { to: '/documents', icon: FileText, label: 'Documents' },
  { to: '/verification', icon: ShieldCheck, label: 'Verification' },
  { to: '/compensation', icon: Banknote, label: 'Compensation & R&R' },
  { to: '/possession', icon: Landmark, label: 'Possession' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar({ open, onToggle }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`
          fixed z-40 md:static md:z-auto
          flex flex-col h-screen bg-navy-700 text-white
          transition-all duration-300 ease-in-out
          ${open ? 'w-64' : 'w-0 md:w-[72px]'}
          ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Logo / Brand */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-navy-600 shrink-0">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-500 shrink-0">
            <Landmark className="w-5 h-5 text-white" />
          </div>
          {open && (
            <div className="overflow-hidden">
              <h1 className="text-base font-bold tracking-wide whitespace-nowrap">BHUMI-DARPAN</h1>
              <p className="text-[10px] text-blue-300 whitespace-nowrap leading-tight">Land Acquisition Platform</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          <ul className="space-y-0.5">
            {navItems.map(({ to, icon: Icon, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                      : 'text-blue-100 hover:bg-navy-600 hover:text-white'
                    }
                    ${!open ? 'justify-center' : ''}`
                  }
                  title={!open ? label : undefined}
                >
                  <Icon className="w-[18px] h-[18px] shrink-0" />
                  {open && <span className="whitespace-nowrap">{label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="border-t border-navy-600 p-3 shrink-0">
          {open ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-500 shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">DLAO Officer</p>
                <p className="text-[11px] text-blue-300 truncate">District Land Acquisition Officer</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-500">
                <User className="w-4 h-4" />
              </div>
            </div>
          )}
        </div>

        {/* Toggle */}
        <button
          onClick={onToggle}
          className="hidden md:flex items-center justify-center h-8 border-t border-navy-600 hover:bg-navy-600 transition-colors"
          title={open ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {open ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </aside>
    </>
  )
}
