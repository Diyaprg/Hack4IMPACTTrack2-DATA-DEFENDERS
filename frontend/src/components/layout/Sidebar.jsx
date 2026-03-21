import { NavLink } from 'react-router-dom'
import { Shield, LayoutDashboard, Search, Layers, Bell, Activity } from 'lucide-react'
import { cn } from '../../lib/utils'
import PulseDot from '../shared/PulseDot'

const NAV = [
  { to: '/dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/verify',     label: 'Verify',      icon: Search },
  { to: '/campaigns',  label: 'Campaigns',   icon: Layers },
  { to: '/alerts',     label: 'Alerts',      icon: Bell },
]

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-16 lg:w-52 bg-navy-800 border-r border-white/5 flex flex-col z-30">
      {/* Logo */}
      <NavLink to="/" className="flex items-center gap-2.5 px-4 py-5 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
          <Shield size={16} className="text-blue-400" />
        </div>
        <span className="hidden lg:block font-bold text-white text-sm tracking-wide">SurakshAI</span>
      </NavLink>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
              isActive
                ? 'bg-blue-600/20 text-blue-300 border border-blue-500/20'
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
            )}
          >
            <Icon size={16} className="flex-shrink-0" />
            <span className="hidden lg:block">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Status */}
      <div className="px-3 py-4 border-t border-white/5">
        <div className="flex items-center gap-2 px-2">
          <PulseDot color="bg-green-500" size="w-1.5 h-1.5" />
          <span className="hidden lg:block text-xs text-slate-500">System Active</span>
        </div>
      </div>
    </aside>
  )
}
