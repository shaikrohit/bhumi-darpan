import { Routes, Route } from 'react-router-dom'
import AppLayout from './layouts/AppLayout.jsx'
import { routes } from './routes/routesConfig.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {routes.map((route, idx) => (
          <Route
            key={route.path || idx}
            index={route.path === '/'}
            path={route.path === '/' ? undefined : route.path}
            element={route.element}
          />
        ))}
      </Route>
    </Routes>
  )
}
