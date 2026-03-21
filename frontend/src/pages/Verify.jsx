import { useState } from 'react'
import Layout from '../components/layout/Layout'
import VerifyInput from '../components/verify/VerifyInput'
import VerifyResult from '../components/verify/VerifyResult'
import { useStats } from '../hooks/useStats'

export default function Verify() {
  const [result, setResult] = useState(null)
  const { stats } = useStats(10000)

  return (
    <Layout title="Citizen Verification Portal">
      <div className="max-w-2xl mx-auto py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Is this a scam?</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Check any suspicious phone number, UPI ID, or video link against our
            real-time fraud intelligence database.
          </p>
        </div>

        <VerifyInput onResult={setResult} />

        {result && (
          <div className="mt-4">
            <VerifyResult result={result} />
          </div>
        )}

        {/* Live counter */}
        <div className="mt-8 flex items-center justify-center gap-6 text-center">
          <div>
            <div className="text-xl font-bold text-blue-400">
              {(stats?.graph?.total_nodes || 0).toLocaleString()}
            </div>
            <div className="text-xs text-slate-600 mt-0.5">Known threat entities</div>
          </div>
          <div className="w-px h-8 bg-white/5" />
          <div>
            <div className="text-xl font-bold text-red-400">
              {(stats?.total_threats || 0).toLocaleString()}
            </div>
            <div className="text-xs text-slate-600 mt-0.5">Threats detected today</div>
          </div>
          <div className="w-px h-8 bg-white/5" />
          <div>
            <div className="text-xl font-bold text-green-400">
              {(stats?.active_campaigns || 0).toLocaleString()}
            </div>
            <div className="text-xs text-slate-600 mt-0.5">Active campaigns tracked</div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-700 mt-6">
          Powered by SurakshAI — Real-time threat intelligence for India
        </p>
      </div>
    </Layout>
  )
}
