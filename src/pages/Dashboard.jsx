import { useState } from 'react'
import Layout from '../components/layout/Layout'
import StatsBar from '../components/dashboard/StatsBar'
import ThreatFeed from '../components/dashboard/ThreatFeed'
import IndiaHeatmap from '../components/dashboard/IndiaHeatmap'
import NetworkGraph from '../components/dashboard/NetworkGraph'
import ThreatVolumeChart from '../components/dashboard/ThreatVolumeChart'
import ThreatTypeDonut from '../components/dashboard/ThreatTypeDonut'

export default function Dashboard() {
  const [stateFilter, setStateFilter] = useState(null)

  return (
    <Layout title="Threat Intelligence Dashboard">
      <StatsBar />

      {/* Main grid */}
      <div className=" ml-5 grid grid-cols-12 gap-4 h-[calc(100vh-13rem)]">
        {/* Left — Threat Feed */}
        <div className="col-span-12 lg:col-span-4 min-h-0">
          <ThreatFeed stateFilter={stateFilter} />
        </div>

        {/* Centre — Heatmap */}
        <div className=" col-span-12 lg:col-span-5 min-h-0">
          <IndiaHeatmap onStateClick={s => setStateFilter(prev => prev === s ? null : s)} />
        </div>

        {/* Right — Charts */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4 min-h-0">
          <div className="flex-1 min-h-0">
            <ThreatTypeDonut />
          </div>
        </div>
      </div>

      {/* Bottom — Volume + Network */}
      <div className="grid grid-cols-12 gap-4 mt-4 ml-5" style={{ height: '220px' }}>
        <div className="col-span-12 lg:col-span-7 min-h-0">
          <ThreatVolumeChart />
        </div>
        <div className="col-span-12 lg:col-span-5 min-h-0">
          <NetworkGraph />
        </div>
      </div>
    </Layout>
  )
}
