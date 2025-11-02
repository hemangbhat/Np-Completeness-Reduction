import ReductionFlow from './components/ReductionFlow'
import InfoPanel from './components/InfoPanel'
import ReductionExplainer from './components/ReductionExplainer'
import VisualTransformation from './components/VisualTransformation'
import 'reactflow/dist/style.css'

const App = () => (
  <div className="min-h-screen bg-slate-900 text-slate-100">
    {/* Fixed heading anchors the learning context while users explore the flow. */}
    <header className="fixed inset-x-0 top-0 z-40 border-b border-slate-800/60 bg-slate-900/95 px-6 py-6 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 text-center lg:text-left">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
            NP-Completeness & Reductions Visualizer
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            An educational visualization showing how NP-complete problems reduce into each other. Watch the
            transformation from Boolean logic (SAT) through structured clauses (3-CNF) into graph problems
            (CLIQUE). Understand why reductions are the backbone of computational complexity theory.
          </p>
        </div>
      </div>
    </header>

    <main className="mx-auto w-full max-w-7xl space-y-10 px-6 pt-32 pb-16">
      {/* Introduction section */}
      <section className="rounded-3xl border border-slate-800/60 bg-linear-to-br from-slate-900 via-slate-950 to-black p-6 shadow-2xl shadow-slate-950/30">
        <h2 className="text-xl font-semibold text-slate-100">Why Reductions Matter</h2>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-300">
          <p>
            <strong className="text-cyan-400">Reductions</strong> are the core technique for proving
            NP-completeness. A reduction shows how to convert one problem (A) into another problem (B) such
            that solving B would also solve A.
          </p>
          <p>
            If we can reduce a known NP-complete problem to a new problem, then the new problem is also
            NP-complete. Formally: <strong>If A ≤ₚ B</strong> (A reduces to B in polynomial time) and A is
            NP-complete → then <strong>B is NP-complete</strong>.
          </p>
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <p className="text-emerald-200">
              <strong>🎯 This site visualizes the classic reduction chain:</strong>
              <br />
              SAT → 3-CNF (3-SAT) → CLIQUE
            </p>
            <p className="mt-2 text-xs text-emerald-300/80">
              Each arrow represents a polynomial-time transformation that preserves the problem's
              computational essence.
            </p>
          </div>
        </div>
      </section>

      {/* Main flow visualization */}
      <section className="w-full">
        <h2 className="mb-4 text-xl font-semibold text-slate-100">Reduction Flow Diagram</h2>
        <ReductionFlow />
      </section>

      {/* How reductions work */}
      <section className="w-full">
        <ReductionExplainer />
      </section>

      {/* Visual transformation examples */}
      <section className="w-full">
        <VisualTransformation />
      </section>

      {/* Problem details */}
      <section className="w-full">
        <InfoPanel />
      </section>
    </main>

    <footer className="px-6 pb-10 text-center text-xs uppercase tracking-[0.3em] text-slate-500">
      Educational Visual | Built with React, TypeScript, Tailwind, and Framer Motion
    </footer>
  </div>
)

export default App
