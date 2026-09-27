import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import TopNavbar from '../components/TopNavbar.jsx'
import ToastContainer from '../components/ToastContainer.jsx'

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'info') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNavbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} addToast={addToast} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet context={{ addToast }} />
        </main>
      </div>
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
    </div>
  )
}
