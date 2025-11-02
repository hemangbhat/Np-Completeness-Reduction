import { memo } from 'react'
import { motion } from 'framer-motion'
import type { NodeProps } from 'reactflow'

export type ProblemNodeData = {
  title: string
  subtitle: string
  summary: string
}

// Transition curve reused for entrance/hover animations to keep the flow cohesive.
const transition = {
  duration: 0.5,
  ease: [0.16, 1, 0.3, 1] as const,
}

const hoverTransition = {
  duration: 0.2,
  ease: [0.4, 0, 0.2, 1] as const,
}

const ProblemNodeComponent = ({ data }: NodeProps<ProblemNodeData>) => {
  // Different gradient colors for each problem type
  const gradients: Record<string, string> = {
    SAT: 'from-blue-900/80 via-slate-900 to-slate-950',
    '3-CNF': 'from-cyan-900/80 via-slate-900 to-slate-950',
    CLIQUE: 'from-purple-900/80 via-slate-900 to-slate-950',
  }

  const glowColors: Record<string, string> = {
    SAT: 'hover:shadow-blue-500/30 hover:ring-blue-500/20',
    '3-CNF': 'hover:shadow-cyan-500/30 hover:ring-cyan-500/20',
    CLIQUE: 'hover:shadow-purple-500/30 hover:ring-purple-500/20',
  }

  const gradient = gradients[data.title] || 'from-slate-800 via-slate-900 to-slate-950'
  const glowColor = glowColors[data.title] || 'hover:shadow-slate-500/40 hover:ring-slate-500/10'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{
        scale: 1.05,
        transition: hoverTransition,
      }}
      transition={transition}
      whileTap={{ scale: 0.98, transition: hoverTransition }}
      className={`group relative w-72 cursor-pointer rounded-3xl border border-slate-700/60 bg-linear-to-br ${gradient} p-6 shadow-2xl shadow-slate-950/60 ring-0 ring-slate-500/0 backdrop-blur-sm transition-all duration-300 ${glowColor} hover:border-slate-600/80 hover:ring-4`}
      style={{ minWidth: '288px' }}
    >
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 h-16 w-16 overflow-hidden rounded-tr-3xl opacity-20">
        <div className="absolute -top-8 -right-8 h-16 w-16 rounded-full bg-white blur-xl"></div>
      </div>

      {/* Icon badge */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800/60 text-lg backdrop-blur-sm ring-1 ring-slate-700/50">
          {data.title === 'SAT' && '📝'}
          {data.title === '3-CNF' && '⚙️'}
          {data.title === 'CLIQUE' && '🕸️'}
        </div>
        <div className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-500/30">
          NP-Complete
        </div>
      </div>

      <h3 className="text-xl font-bold tracking-tight text-slate-50">
        {data.title}
      </h3>
      <p className="mt-1 text-xs font-medium uppercase tracking-[0.3em] text-slate-400">
        {data.subtitle}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-slate-300">
        {data.summary}
      </p>

      {/* Bottom glow line */}
      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-slate-800">
        <motion.div
          className="h-full bg-linear-to-r from-transparent via-cyan-500 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    </motion.div>
  )
}

// Wrap in memo so React Flow avoids rerendering nodes unnecessarily while panning/zooming.
const ProblemNode = memo(ProblemNodeComponent)
ProblemNode.displayName = 'ProblemNode'

export default ProblemNode
