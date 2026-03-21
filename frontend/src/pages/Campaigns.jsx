import Layout from '../components/layout/Layout'
import CampaignTable from '../components/campaigns/CampaignTable'
import { useCampaigns } from '../hooks/useCampaigns'
import StatCard from '../components/shared/StatCard'
import { Layers, AlertTriangle, CheckCircle, Eye } from 'lucide-react'

export default function Campaigns() {
  const { campaigns } = useCampaigns()

  const critical    = campaigns.filter(c => c.severity === 'critical').length
  const active      = campaigns.filter(c => c.status === 'active').length
  const neutralised = campaigns.filter(c => c.status === 'neutralised').length

  return (
    <Layout title="Campaign Tracker">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard label="Total Campaigns"   value={campaigns.length} icon={Layers}        color="text-blue-400" />
        <StatCard label="Critical"          value={critical}         icon={AlertTriangle}  color="text-red-400" />
        <StatCard label="Active"            value={active}           icon={Eye}            color="text-orange-400" />
        <StatCard label="Neutralised"       value={neutralised}      icon={CheckCircle}    color="text-green-400" />
      </div>
      <CampaignTable />
    </Layout>
  )
}
