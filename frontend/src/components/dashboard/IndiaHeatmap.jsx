import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { useThreats } from '../../hooks/useThreats'

const INDIA_STATES_SIMPLE = [
  { name: 'Maharashtra',    x: 200, y: 280, w: 80, h: 60 },
  { name: 'Uttar Pradesh',  x: 270, y: 160, w: 90, h: 55 },
  { name: 'Bihar',          x: 330, y: 190, w: 55, h: 45 },
  { name: 'Delhi',          x: 250, y: 155, w: 25, h: 22 },
  { name: 'Karnataka',      x: 195, y: 340, w: 70, h: 55 },
  { name: 'Tamil Nadu',     x: 215, y: 395, w: 55, h: 60 },
  { name: 'Gujarat',        x: 130, y: 225, w: 70, h: 60 },
  { name: 'Rajasthan',      x: 145, y: 160, w: 90, h: 75 },
  { name: 'West Bengal',    x: 370, y: 215, w: 50, h: 60 },
  { name: 'Andhra Pradesh', x: 220, y: 330, w: 70, h: 55 },
  { name: 'Madhya Pradesh', x: 210, y: 230, w: 90, h: 60 },
  { name: 'Punjab',         x: 190, y: 110, w: 50, h: 40 },
  { name: 'Haryana',        x: 225, y: 130, w: 40, h: 35 },
  { name: 'Kerala',         x: 195, y: 410, w: 35, h: 65 },
  { name: 'Telangana',      x: 230, y: 305, w: 60, h: 45 },
  { name: 'Assam',          x: 410, y: 190, w: 55, h: 40 },
  { name: 'Odisha',         x: 310, y: 270, w: 60, h: 55 },
  { name: 'Jharkhand',      x: 320, y: 225, w: 50, h: 45 },
  { name: 'Chhattisgarh',   x: 270, y: 260, w: 60, h: 55 },
  { name: 'Uttarakhand',    x: 240, y: 125, w: 50, h: 38 },
]

export default function IndiaHeatmap({ onStateClick }) {
  const svgRef  = useRef(null)
  const { threats } = useThreats()
  const [hovered, setHovered] = useState(null)

  const stateCounts = {}
  threats.forEach(t => {
    (t.target_states || []).forEach(s => {
      stateCounts[s] = (stateCounts[s] || 0) + 1
    })
  })

  const maxCount  = Math.max(...Object.values(stateCounts), 1)
  const colorScale = d3.scaleSequential()
    .domain([0, maxCount])
    .interpolator(d3.interpolateRgb('#1e3a5f', '#ef4444'))

  return (
    <div className="card p-3 h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="p-3 border-b border-white/5 flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Threat Heatmap</span>
        <span className="text-xs text-slate-600">Click state to filter</span>
        </div>
      </div>

      <div className="flex-1 relative">
        <svg
          ref={svgRef}
          viewBox="0 0 500 520"
          className="w-full h-full"
          style={{ maxHeight: '320px' }}
        >
          {INDIA_STATES_SIMPLE.map((state) => {
            const count = stateCounts[state.name] || 0
            const fill  = count > 0 ? colorScale(count) : '#1a2540'
            const isHov = hovered === state.name

            return (
              <g
                key={state.name}
                className="cursor-pointer"
                onClick={() => onStateClick?.(state.name)}
                onMouseEnter={() => setHovered(state.name)}
                onMouseLeave={() => setHovered(null)}
              >
                <rect
                  x={state.x} y={state.y}
                  width={state.w} height={state.h}
                  rx={4}
                  fill={fill}
                  stroke={isHov ? '#60a5fa' : '#ffffff10'}
                  strokeWidth={isHov ? 1.5 : 0.5}
                  opacity={isHov ? 1 : 0.85}
                />
                {count > 0 && (
                  <text
                    x={state.x + state.w / 2}
                    y={state.y + state.h / 2 - 4}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="white"
                    fontSize={9}
                    fontWeight={600}
                    opacity={0.9}
                  >
                    {count}
                  </text>
                )}
                <text
                  x={state.x + state.w / 2}
                  y={state.y + state.h / 2 + (count > 0 ? 7 : 0)}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={count > 0 ? '#ffffffcc' : '#ffffff40'}
                  fontSize={7}
                >
                  {state.name.length > 10 ? state.name.slice(0, 9) + '…' : state.name}
                </text>
              </g>
            )
          })}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-0 right-0 flex items-center gap-1 text-xs text-slate-600">
          <span>Low</span>
          <div className="w-16 h-2 rounded" style={{
            background: 'linear-gradient(to right, #1e3a5f, #ef4444)'
          }} />
          <span>High</span>
        </div>

        {/* Tooltip */}
        {hovered && (
          <div className="absolute top-2 left-2 bg-navy-800 border border-white/10 rounded-lg px-3 py-2 text-xs pointer-events-none">
            <div className="font-medium text-white">{hovered}</div>
            <div className="text-slate-400">{stateCounts[hovered] || 0} active threats</div>
          </div>
        )}
      </div>
    </div>
  )
}
