import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing   from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Verify    from './pages/Verify'
import Campaigns from './pages/Campaigns'
import Alerts    from './pages/Alerts'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"           element={<Landing />} />
        <Route path="/dashboard"  element={<Dashboard />} />
        <Route path="/verify"     element={<Verify />} />
        <Route path="/campaigns"  element={<Campaigns />} />
        <Route path="/alerts"     element={<Alerts />} />
        <Route path="*"           element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
