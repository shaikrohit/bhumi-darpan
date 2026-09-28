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
  { to: '/land-parcels', icon: MapPin, label: 'Land Parcels' },
  { to: '/documents', icon: FileText, label: 'Documents' },
  { to: '/verification', icon: ShieldCheck, label: 'Verification' },
  { to: '/compensation', icon: Banknote, label: 'Compensation & R&R' },
  { to: '/possession', icon: Landmark, label: 'Possession' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar({ open, onToggle, user = { name: 'DLAO Officer', role: 'District Land Acquisition Officer' } }) {
  const handleNavClick = () => {
    // On mobile, close sidebar drawer when a navigation link is clicked
    if (window.innerWidth < 768 && open) {
      onToggle()
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <button
          type="button"
          aria-label="Close navigation sidebar"
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-xs md:hidden cursor-pointer"
          onClick={onToggle}
        />
      )}

      <aside
        aria-label="Main Navigation"
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
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-500 shrink-0 shadow-sm">
            <Landmark className="w-5 h-5 text-white" aria-hidden="true" />
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
          <ul className="space-y-1">
            {navItems.map(({ to, icon: Icon, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                    ${isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40 font-semibold'
                      : 'text-blue-100 hover:bg-navy-600 hover:text-white'
                    }
                    ${!open ? 'justify-center' : ''}`
                  }
                  title={!open ? label : undefined}
                  aria-label={label}
                >
                  <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
                  {open && <span className="whitespace-nowrap">{label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile Footer */}
        <div className="border-t border-navy-600 p-3 shrink-0">
          {open ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-600 text-white font-semibold shrink-0 shadow-sm">
                <User className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold truncate leading-tight">{user.name}</p>
                <p className="text-[11px] text-blue-300 truncate">{user.role}</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center" title={`${user.name} (${user.role})`}>
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-600 text-white">
                <User className="w-5 h-5" aria-hidden="true" />
              </div>
            </div>
          )}
        </div>

        {/* Desktop Toggle */}
        <button
          type="button"
          onClick={onToggle}
          aria-label={open ? 'Collapse navigation sidebar' : 'Expand navigation sidebar'}
          aria-expanded={open}
          className="hidden md:flex items-center justify-center h-10 border-t border-navy-600 hover:bg-navy-600 transition-colors cursor-pointer text-blue-200 hover:text-white"
        >
          {open ? (
            <div className="flex items-center gap-1 text-xs font-medium">
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              <span>Collapse</span>
            </div>
          ) : (
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          )}
        </button>
      </aside>
    </>
  )
}
