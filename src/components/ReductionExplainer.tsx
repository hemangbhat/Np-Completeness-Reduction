import { motion } from 'framer-motion'
import { useState } from 'react'

type ReductionStep = {
  id: string
  from: string
  to: string
  title: string
  explanation: string
  keyIdea: string
  transformation: {
    input: string
    output: string
    mapping: string[]
  }
}

const reductionSteps: ReductionStep[] = [
  {
    id: 'sat-to-3cnf',
    from: 'SAT',
    to: '3-CNF',
    title: 'SAT → 3-CNF (Tseitin Transformation)',
    explanation:
      'Convert any Boolean formula into Conjunctive Normal Form where each clause has exactly 3 literals. This normalizes the problem while preserving satisfiability.',
    keyIdea: 'Split long clauses using helper variables, pad short clauses with dummy literals.',
    transformation: {
      input: 'Arbitrary Boolean formula',
      output: 'AND of clauses, each with exactly 3 literals',
      mapping: [
        '• Clause with >3 literals → Split using new variable',
        '• Clause with <3 literals → Pad with dummy variable',
        '• Nested formulas → Flatten using Tseitin encoding',
      ],
    },
  },
  {
    id: '3cnf-to-clique',
    from: '3-CNF',
    to: 'CLIQUE',
    title: '3-CNF → CLIQUE (Formula to Graph)',
    explanation:
      'Transform a Boolean satisfiability problem into a graph problem. Each clause becomes a set of vertices, and edges connect non-contradictory literals.',
    keyIdea:
      'A k-clique in the constructed graph corresponds to a satisfying assignment for the formula.',
    transformation: {
      input: '3-CNF formula with k clauses',
      output: 'Graph G where we search for k-clique',
      mapping: [
        '• Each literal in each clause → Vertex in graph',
        '• Two vertices connected → If literals can both be true (not contradictory)',
        '• k-clique exists → Satisfying assignment exists',
      ],
    },
  },
]

const ReductionExplainer = () => {
  const [selectedReduction, setSelectedReduction] = useState<string>(reductionSteps[0].id)

  const currentReduction = reductionSteps.find((r) => r.id === selectedReduction)!

  return (
    <div className="space-y-5 rounded-3xl border border-slate-800/60 bg-slate-950/40 p-6 shadow-2xl shadow-slate-950/30">
      <header>
        <h2 className="text-xl font-semibold tracking-tight text-slate-100">
          How Reductions Work
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          Reductions are the core technique for proving NP-completeness. They show how to convert one
          problem into another while preserving the solution structure.
        </p>
      </header>

      {/* Reduction selector */}
      <div className="flex flex-wrap gap-2">
        {reductionSteps.map((step) => (
          <button
            key={step.id}
            onClick={() => setSelectedReduction(step.id)}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
              selectedReduction === step.id
                ? 'border-cyan-500/60 bg-cyan-500/10 text-cyan-300'
                : 'border-slate-700 bg-slate-800/60 text-slate-300 hover:border-slate-600 hover:bg-slate-800'
            }`}
          >
            {step.from} → {step.to}
          </button>
        ))}
      </div>

      {/* Reduction details with animation */}
      <motion.div
        key={currentReduction.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-4"
      >
        {/* Title and explanation */}
        <div className="rounded-2xl border border-slate-700/60 bg-linear-to-br from-slate-800 via-slate-900 to-slate-950 p-5">
          <h3 className="text-lg font-semibold text-slate-100">{currentReduction.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            {currentReduction.explanation}
          </p>
          <div className="mt-4 rounded-lg border border-dashed border-cyan-500/30 bg-cyan-500/5 p-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Key Idea:
            </span>
            <p className="mt-1 text-sm text-cyan-200">{currentReduction.keyIdea}</p>
          </div>
        </div>

        {/* Transformation mapping */}
        <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-5">
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-300">
            Transformation Steps
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-xs font-bold text-blue-400">
                →
              </div>
              <div>
                <span className="text-xs font-medium uppercase tracking-wide text-slate-400">Input:</span>
                <p className="text-sm text-slate-200">{currentReduction.transformation.input}</p>
              </div>
            </div>

            <div className="ml-3 space-y-2 border-l-2 border-slate-700 pl-6">
              {currentReduction.transformation.mapping.map((step, idx) => (
                <p key={idx} className="text-sm text-slate-300">
                  {step}
                </p>
              ))}
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">
                ✓
              </div>
              <div>
                <span className="text-xs font-medium uppercase tracking-wide text-slate-400">Output:</span>
                <p className="text-sm text-slate-200">{currentReduction.transformation.output}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Why it matters */}
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <div className="flex items-start gap-3">
            <span className="text-lg">💡</span>
            <div>
              <h4 className="text-sm font-semibold text-amber-200">Why This Matters</h4>
              <p className="mt-1.5 text-xs leading-relaxed text-amber-100/80">
                If we can solve {currentReduction.to} efficiently, we can also solve {currentReduction.from}{' '}
                efficiently. Since {currentReduction.from} is NP-complete, proving this reduction shows{' '}
                {currentReduction.to} is also NP-complete.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Educational footer */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-4 text-xs text-slate-400">
        <p className="font-semibold text-slate-300">Educational Insight:</p>
        <p className="mt-1.5 leading-relaxed">
          Reductions form chains: SAT → 3-CNF → CLIQUE → VERTEX COVER → ... Each link preserves
          computational hardness, building a web of interconnected NP-complete problems.
        </p>
      </div>
    </div>
  )
}

export default ReductionExplainer
