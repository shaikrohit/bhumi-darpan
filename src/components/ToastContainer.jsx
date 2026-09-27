import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react'

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const colors = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
}

const iconColors = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-amber-500',
  info: 'text-blue-500',
}

export default function ToastContainer({ toasts, onDismiss }) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2">
      {toasts.map((toast) => {
        const Icon = icons[toast.type] || icons.info
        return (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg animate-slide-in-right min-w-72 ${colors[toast.type] || colors.info}`}
          >
            <Icon className={`w-5 h-5 shrink-0 ${iconColors[toast.type] || iconColors.info}`} />
            <p className="text-sm font-medium flex-1">{toast.message}</p>
            <button onClick={() => onDismiss(toast.id)} className="p-0.5 rounded hover:bg-black/5">
              <X className="w-4 h-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
