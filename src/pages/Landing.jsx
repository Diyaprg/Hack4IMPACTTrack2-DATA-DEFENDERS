import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Shield, ArrowRight, Search, LayoutDashboard, Zap, Lock, Globe } from 'lucide-react'
import { motion } from 'framer-motion'
import ThreatTicker from '../components/shared/ThreatTicker'
import { useStats } from '../hooks/useStats'

function AnimatedCounter({ target, duration = 2000 }) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    const steps = 60
    const step = target / steps
    const delay = duration / steps
    let current = 0
    const timer = setInterval(() => {
      current += step
      if (current >= target) { setValue(target); clearInterval(timer) }
      else setValue(Math.floor(current))
    }, delay)
    return () => clearInterval(timer)
  }, [target, duration])
  return <span>{value.toLocaleString()}</span>
}

export default function Landing() {
  const { stats } = useStats()

  return (
    <div className="relative min-h-screen flex flex-col bg-[#050505] text-slate-200 overflow-hidden">
      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full" />
        
        <div className="absolute top-[30%] -left-[10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />

        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, size: '40px 40px', backgroundSize: '40px 40px' }} 
        />
      </div>

      <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-white/5 backdrop-blur-md bg-black/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-emerald-500 p-[1px]">
            <div className="w-full h-full rounded-xl bg-[#050505] flex items-center justify-center">
              <Shield size={20} className="text-emerald-400" />
            </div>
          </div>
          <span className="font-bold text-xl text-white tracking-tight">Suraksh<span className="text-emerald-400">AI</span></span>
        </div>

          <div className="flex items-center gap-3">
           {[
         { label: 'Alerts', path: '/alerts' },
         { label: 'Campaigns', path: '/dashboard' }
           ].map((btn) => (
        <Link
          key={btn.label}
          to={btn.path}
          className="px-5 py-2 rounded-lg text-sm font-medium tracking-wide text-emerald-400/90 border border-purple-300/10 
                 bg-emerald-500/5 backdrop-blur-md hover:bg-purple-500/10 hover:border-purple-500/30 hover:text-emerald-400 transition-all duration-300"
        >
      {btn.label}
      </Link>
      ))}
    </div>
      </nav>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-20 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/5 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-80"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            Live Threat Monitoring Active
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-[1.1] mb-6 max-w-4xl mx-auto">
            India's Next-Gen <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-purple-400 to-blue-500">
              Cyber Defence Layer
            </span>
          </h1>

          <p className="text-lg md:text-md text-slate-400 max-w-2xl mx-auto mb-20 leading-relaxed font-light">
            An intelligence-led shield for the UPI ecosystem. We neutralize 
            <span className="text-white font-medium"> AI-driven financial fraud </span> before it hits the consumer.
          </p>

      <div className="flex items-center justify-center gap-6 flex-wrap mb-32">
      
      <div className="relative group">
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-emerald-500/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    
        <Link to="/dashboard" className="relative flex items-center gap-2.5 px-3 py-2.5 rounded-full 
                 bg-black/30 backdrop-blur-lg border border-white/10
                 hover:border-white-500/50 transition-all duration-500
                 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]">

          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
      
          <LayoutDashboard size={18} className="text-emerald-400" />
          <span className="text-white font-small tracking-wide text-lg">
           Access Dashboard
          </span>
        <ArrowRight size={18} className="text-emerald-400 group-hover:translate-x-1 transition-transform" />
        </Link>
     </div>

        <Link to="/verify" className="px-6 py-3 rounded-full border border-white/2 bg-white/5
               text-slate-400 font-medium tracking-wide text-lg
               hover:bg-white/10 hover:text-white transition-all duration-300" >
       <span className="flex items-center gap-2">
       <Search size={18} />
       Scan Identity
       </span>
       </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 max-w-5xl mx-auto">
  {[
    { label: 'Threats Neutralized', value: stats?.total_threats || 0, color: 'from-purple-500/20 to-purple-500/5', icon: <Lock className="text-purple-400" size={16}/>, textColor: 'text-purple-400', shadow: 'group-hover:shadow-purple-500/30' },
    { label: 'Active Campaigns', value: stats?.active_campaigns || 0, color: 'from-emerald-500/20 to-emerald-500/5', icon: <Zap className="text-emerald-400" size={16}/>, textColor: 'text-emerald-400', shadow: 'group-hover:shadow-emerald-500/30' },
    { label: 'Banking Nodes Alerted', value: stats?.total_alerts || 0, color: 'from-blue-500/20 to-blue-500/5', icon: <Globe className="text-blue-400" size={16}/>, textColor: 'text-blue-400', shadow: 'group-hover:shadow-blue-500/30' },
    { label: 'Capital Protected (est.)', value: 20000, color: 'from-emerald-500/20 to-emerald-500/5', icon: <Shield className="text-emerald-400" size={16}/>, textColor: 'text-emerald-400', suffix: ' Cr', shadow: 'group-hover:shadow-emerald-500/30' },
  ].map((s, i) => (
    <motion.div
      key={i}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 + i * 0.1 }}
      className={`relative group p-6 rounded-2xl bg-gradient-to-b ${s.color} border border-white/10 backdrop-blur-xl transition-all duration-500 
                 hover:border-white/20 hover:-translate-y-1 ${s.shadow} hover:shadow-[0_0_30px_-5px_rgba(0,0,0,0.3)]`}
    >
      {/* Subtle Inner Highlight on Hover */}
      <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <div className="relative z-10 flex items-center gap-2 mb-3 opacity-60 group-hover:opacity-100 transition-opacity">
         <div className="p-1 rounded-md bg-white/5">
           {s.icon}
         </div>
         <span className="text-[10px] uppercase tracking-widest font-bold">{s.label}</span>
      </div>
      
      <div className={`relative z-10 text-3xl font-black tabular-nums transition-transform duration-500 group-hover:scale-105 ${s.textColor}`}>
        {s.label.includes('Capital') ? '₹' : ''}
        <AnimatedCounter target={s.value} />
        {s.suffix || ''}
      </div>

      <div className={`absolute top-0 right-0 w-12 h-12 bg-gradient-to-br ${s.color} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />
    </motion.div>
  ))}
</div>
        </motion.div>
      </main>

      <div className="relative z-20 mt-auto border-t border-white/5 bg-black/40 backdrop-blur-xl">
        <ThreatTicker />
      </div>

      <footer className="relative z-10 text-center py-6 text-[10px] text-slate-500 uppercase tracking-[0.2em] font-medium">
        SurakshAI — Built for Hack 4 Impact 2026 · SDIS KIIT · Track 2: Cybersecurity &amp; Ethical AI
      </footer>
    </div>
  )
}