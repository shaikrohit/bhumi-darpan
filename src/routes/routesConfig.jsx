import { Navigate } from 'react-router-dom'
import Dashboard from '../pages/Dashboard.jsx'
import Projects from '../pages/Projects.jsx'
import ProjectDetails from '../pages/ProjectDetails.jsx'
import Parcels from '../pages/Parcels.jsx'
import Documents from '../pages/Documents.jsx'
import Verification from '../pages/Verification.jsx'
import Compensation from '../pages/Compensation.jsx'
import Possession from '../pages/Possession.jsx'
import Notifications from '../pages/Notifications.jsx'
import Analytics from '../pages/Analytics.jsx'
import Settings from '../pages/Settings.jsx'

export const routes = [
  { path: '/', element: <Navigate to="/dashboard" replace /> },
  { path: 'dashboard', element: <Dashboard />, label: 'Dashboard' },
  { path: 'projects', element: <Projects />, label: 'Projects' },
  { path: 'projects/:projectId', element: <ProjectDetails />, label: 'Project Details' },
  { path: 'land-parcels', element: <Parcels />, label: 'Land Parcels' },
  { path: 'parcels', element: <Navigate to="/land-parcels" replace /> },
  { path: 'documents', element: <Documents />, label: 'Documents' },
  { path: 'verification', element: <Verification />, label: 'Verification' },
  { path: 'compensation', element: <Compensation />, label: 'Compensation & R&R' },
  { path: 'possession', element: <Possession />, label: 'Possession' },
  { path: 'notifications', element: <Notifications />, label: 'Notifications' },
  { path: 'analytics', element: <Analytics />, label: 'Analytics' },
  { path: 'settings', element: <Settings />, label: 'Settings' },
  { path: '*', element: <Navigate to="/dashboard" replace /> },
]
