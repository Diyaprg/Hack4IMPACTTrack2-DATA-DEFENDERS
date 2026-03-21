import { clsx } from 'clsx'
import { formatDistanceToNow, format } from 'date-fns'

export const cn = (...args) => clsx(...args)

export const CATEGORY_LABELS = {
  investment_scam:    'Investment Scam',
  voice_clone:        'Voice Clone',
  fake_upi_refund:    'Fake UPI Refund',
  phishing:           'Phishing',
  mule_recruitment:   'Mule Recruitment',
  deepfake_celebrity: 'Deepfake Celebrity',
  lottery_scam:       'Lottery Scam',
  unknown:            'Unknown',
}

export const CATEGORY_COLORS = {
  investment_scam:    'bg-purple-500/15 text-purple-300 border-purple-500/20',
  voice_clone:        'bg-pink-500/15 text-pink-300 border-pink-500/20',
  fake_upi_refund:    'bg-amber-500/15 text-amber-300 border-amber-500/20',
  phishing:           'bg-red-500/15 text-red-300 border-red-500/20',
  mule_recruitment:   'bg-cyan-500/15 text-cyan-300 border-cyan-500/20',
  deepfake_celebrity: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/20',
  lottery_scam:       'bg-lime-500/15 text-lime-300 border-lime-500/20',
  unknown:            'bg-slate-500/15 text-slate-400 border-slate-500/20',
}

export const SEVERITY_COLORS = {
  critical: 'bg-red-500/15 text-red-400 border-red-500/20',
  high:     'bg-orange-500/15 text-orange-400 border-orange-500/20',
  medium:   'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  low:      'bg-green-500/15 text-green-400 border-green-500/20',
}

export const SEVERITY_DOT = {
  critical: 'bg-red-500',
  high:     'bg-orange-500',
  medium:   'bg-yellow-500',
  low:      'bg-green-500',
}

export const THREAT_LEVEL_CONFIG = {
  critical: { color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/30',    label: 'CRITICAL' },
  high:     { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', label: 'HIGH' },
  elevated: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', label: 'ELEVATED' },
  normal:   { color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/30',  label: 'NORMAL' },
}

export const timeAgo = (date) => {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true })
  } catch {
    return 'Unknown'
  }
}

export const formatDate = (date, fmt = 'dd MMM yyyy HH:mm') => {
  try {
    return format(new Date(date), fmt)
  } catch {
    return '—'
  }
}

export const truncate = (str, n = 80) =>
  str && str.length > n ? str.slice(0, n) + '…' : str

export const formatCr = (val) =>
  typeof val === 'number' ? `₹${val.toFixed(1)} Cr` : '—'

export const confidenceColor = (conf) => {
  if (conf >= 0.85) return 'text-red-400'
  if (conf >= 0.70) return 'text-orange-400'
  if (conf >= 0.55) return 'text-yellow-400'
  return 'text-green-400'
}

export const NODE_COLORS = {
  phone:    '#EF4444',
  upi:      '#F59E0B',
  telegram: '#8B5CF6',
  campaign: '#3B82F6',
  unknown:  '#6B7280',
}
