import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './layouts/AppLayout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Projects from './pages/Projects.jsx'
import ProjectDetails from './pages/ProjectDetails.jsx'
import Parcels from './pages/Parcels.jsx'
import Documents from './pages/Documents.jsx'
import Verification from './pages/Verification.jsx'
import Compensation from './pages/Compensation.jsx'
import Possession from './pages/Possession.jsx'
import Notifications from './pages/Notifications.jsx'
import Analytics from './pages/Analytics.jsx'
import Settings from './pages/Settings.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:projectId" element={<ProjectDetails />} />
        <Route path="parcels" element={<Parcels />} />
        <Route path="documents" element={<Documents />} />
        <Route path="verification" element={<Verification />} />
        <Route path="compensation" element={<Compensation />} />
        <Route path="possession" element={<Possession />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}
