import Layout from '../components/layout/Layout'
import AlertTable from '../components/alerts/AlertTable'
import { useAlerts } from '../hooks/useAlerts'
import StatCard from '../components/shared/StatCard'
import { Bell, Building2, ShieldCheck, TrendingUp } from 'lucide-react'
import { formatCr } from '../lib/utils'

export default function Alerts() {
  const { alerts, total } = useAlerts()

  const banksNotified = [...new Set(alerts.flatMap(a => a.banks_notified || []))].length
  const totalProtected = alerts.reduce((sum, a) => sum + (a.estimated_amount_protected_cr || 0), 0)
  const delivered     = alerts.filter(a => a.status === 'delivered').length

  return (
    <Layout title="Alert History">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard label="Total Alerts Filed"    value={total}                    icon={Bell}        color="text-red-400" />
        <StatCard label="Banks Notified"         value={banksNotified}            icon={Building2}   color="text-blue-400" />
        <StatCard label="Successfully Delivered" value={delivered}                icon={ShieldCheck} color="text-green-400" />
        <StatCard label="Est. Amount Protected"  value={formatCr(totalProtected)} icon={TrendingUp}  color="text-amber-400" />
      </div>
      <AlertTable />
    </Layout>
  )
}
