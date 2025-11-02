import { motion } from 'framer-motion'

const VisualTransformation = () => (
  <div className="space-y-6 rounded-3xl border border-slate-800/60 bg-slate-950/40 p-6 shadow-2xl shadow-slate-950/30">
    <header>
      <h2 className="text-xl font-semibold tracking-tight text-slate-100">
        What Structure Changes During Reduction
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">
        Reductions transform problem representations while preserving solutions. Here's what changes at each
        step:
      </p>
    </header>

    <div className="space-y-5">
      {/* SAT → 3-CNF */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5"
      >
        <h3 className="flex items-center gap-2 text-base font-semibold text-blue-300">
          <span className="text-xl">📝</span>
          Step 1: Formulas → Normalized Formulas
        </h3>
        <div className="mt-3 space-y-2 text-sm text-slate-300">
          <p>
            <strong className="text-blue-200">Input:</strong> Any Boolean formula (nested, variable-length
            clauses)
          </p>
          <p className="font-mono text-xs text-slate-400">
            Example: (A ∨ B) ∧ (¬C ∨ D ∨ E ∨ F ∨ G)
          </p>
          <p>
            <strong className="text-blue-200">Output:</strong> 3-CNF formula (AND of 3-literal clauses)
          </p>
          <p className="font-mono text-xs text-slate-400">
            Example: (A ∨ B ∨ ⊤) ∧ (¬C ∨ D ∨ x₁) ∧ (¬x₁ ∨ E ∨ x₂) ∧ (¬x₂ ∨ F ∨ G)
          </p>
          <p className="mt-3 rounded-lg bg-blue-900/20 p-2 text-xs text-blue-200">
            ✓ Structure: Still a Boolean formula, but now standardized for graph conversion
          </p>
        </div>
      </motion.div>

      {/* 3-CNF → CLIQUE */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-5"
      >
        <h3 className="flex items-center gap-2 text-base font-semibold text-purple-300">
          <span className="text-xl">🕸️</span>
          Step 2: Formulas → Graphs
        </h3>
        <div className="mt-3 space-y-2 text-sm text-slate-300">
          <p>
            <strong className="text-purple-200">Input:</strong> 3-CNF formula with k clauses
          </p>
          <p className="font-mono text-xs text-slate-400">
            Example: (A ∨ B ∨ C) ∧ (¬A ∨ D ∨ E) ∧ (¬B ∨ ¬D ∨ F)
          </p>
          <p>
            <strong className="text-purple-200">Output:</strong> Graph G with vertices and edges
          </p>
          <div className="mt-2 space-y-1.5 text-xs text-slate-400">
            <p>• Vertices: Each literal in each clause becomes a vertex (3k vertices total)</p>
            <p>• Edges: Connect two vertices if they're in different clauses AND not contradictory</p>
            <p>• Goal: Find k-clique (one vertex from each clause, all compatible)</p>
          </div>
          <p className="mt-3 rounded-lg bg-purple-900/20 p-2 text-xs text-purple-200">
            ✓ Structure: Transformed from logic to graph theory - completely different representation!
          </p>
        </div>
      </motion.div>

      {/* Key insight */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4"
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div className="space-y-2 text-sm">
            <h4 className="font-semibold text-amber-200">The Magic of Reductions</h4>
            <p className="leading-relaxed text-amber-100/90">
              Notice how the problem changes form (formulas → graphs) but the <em>difficulty</em> stays the
              same. A solution to CLIQUE gives you a solution to 3-CNF, which gives you a solution to SAT.
              This chain proves all three problems are equally hard—they're all NP-complete.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  </div>
)

export default VisualTransformation
