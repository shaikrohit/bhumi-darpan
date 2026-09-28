import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../navigation/Sidebar.jsx'
import TopNavbar from '../navigation/TopNavbar.jsx'
import ToastContainer from '../ToastContainer.jsx'

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 antialiased text-gray-900">
      {/* Accessibility Skip Link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Navigation Sidebar */}
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNavbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} addToast={addToast} />
        <main
          id="main-content"
          tabIndex={-1}
          aria-label="Main content area"
          className="flex-1 overflow-y-auto p-4 md:p-6 focus:outline-none"
        >
          <Outlet context={{ addToast }} />
        </main>
      </div>

      {/* Toast Feedback Stack */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}
