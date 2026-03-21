import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { getNetworkGraph } from '../../lib/api'
import { NODE_COLORS } from '../../lib/utils'

export default function NetworkGraph() {
  const svgRef    = useRef(null)
  const [graph, setGraph]     = useState(null)
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getNetworkGraph()
      .then(setGraph)
      .catch(console.error)
      .finally(() => setLoading(false))

    const id = setInterval(() => {
      getNetworkGraph().then(setGraph).catch(() => {})
    }, 15000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!graph || !svgRef.current) return

    const el  = svgRef.current
    const W   = el.clientWidth  || 400
    const H   = el.clientHeight || 300

    d3.select(el).selectAll('*').remove()

    const nodes = (graph.nodes || []).slice(0, 80).map(n => ({ ...n }))
    const edges = (graph.edges || [])
      .filter(e => nodes.find(n => n.id === e.source) && nodes.find(n => n.id === e.target))
      .slice(0, 150)
      .map(e => ({ ...e }))

    const svg = d3.select(el)
      .attr('viewBox', `0 0 ${W} ${H}`)

    const sim = d3.forceSimulation(nodes)
      .force('link',   d3.forceLink(edges).id(d => d.id).distance(40).strength(0.5))
      .force('charge', d3.forceManyBody().strength(-60))
      .force('center', d3.forceCenter(W / 2, H / 2))
      .force('collision', d3.forceCollide(12))

    const link = svg.append('g')
      .selectAll('line')
      .data(edges)
      .join('line')
      .attr('stroke', '#ffffff15')
      .attr('stroke-width', d => Math.min(d.weight || 1, 3))

    const node = svg.append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', d => 4 + (d.degree || 0) * 1.2)
      .attr('fill', d => NODE_COLORS[d.type] || NODE_COLORS.unknown)
      .attr('fill-opacity', 0.85)
      .attr('stroke', '#ffffff20')
      .attr('stroke-width', 0.5)
      .style('cursor', 'pointer')
      .on('click', (_, d) => setSelected(d))
      .call(
        d3.drag()
          .on('start', (event, d) => { if (!event.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y })
          .on('drag',  (event, d) => { d.fx = event.x; d.fy = event.y })
          .on('end',   (event, d) => { if (!event.active) sim.alphaTarget(0); d.fx = null; d.fy = null })
      )

    node.append('title').text(d => `${d.type}: ${d.value || d.id}`)

    sim.on('tick', () => {
      link
        .attr('x1', d => d.source.x).attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x).attr('y2', d => d.target.y)
      node
        .attr('cx', d => Math.max(8, Math.min(W - 8, d.x)))
        .attr('cy', d => Math.max(8, Math.min(H - 8, d.y)))
    })

    return () => sim.stop()
  }, [graph])

  return (
    <div className="card p-3 h-full flex flex-col ">
      <div className="flex items-center justify-between mb-2">
        <div className="p-3 border-b border-white/5 flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Operator Network</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-600">
          {Object.entries(NODE_COLORS).slice(0, 3).map(([type, color]) => (
            <span key={type} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              {type}
            </span>
          ))}
        </div>
      </div>

      <div className="flex-1 relative min-h-0">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">
            Building network graph…
          </div>
        ) : (
          <svg ref={svgRef} className="w-full h-full" />
        )}

        {selected && (
          <div className="absolute top-2 right-2 bg-navy-800 border border-white/10 rounded-lg p-3 text-xs max-w-48">
            <div className="font-medium text-white mb-1 break-all">{selected.value || selected.id}</div>
            <div className="text-slate-500 capitalize">Type: {selected.type}</div>
            <div className="text-slate-500">Connections: {selected.degree || 0}</div>
            <div className="text-slate-500">Centrality: {((selected.centrality || 0) * 100).toFixed(1)}%</div>
            <button
              onClick={() => setSelected(null)}
              className="mt-2 text-slate-600 hover:text-slate-400"
            >✕ close</button>
          </div>
        )}
      </div>
    </div>
  )
}
