import { Fragment } from 'react'
import { problems } from '../data/problems'
import FormulaAnimation from './FormulaAnimation'

const InfoPanel = () => (
  <section className="space-y-6 rounded-3xl border border-slate-800/60 bg-slate-950/40 p-6 shadow-2xl shadow-slate-950/30">
    <header>
      <h2 className="text-xl font-semibold tracking-tight text-slate-100">
        Problem Details & Transformation Chain
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">
        Follow the transformation chain from Boolean formulas to graph structures. Each problem preserves
        the computational hardness while changing its representation—this is the essence of polynomial-time
        reductions.
      </p>
    </header>

    <div className="space-y-4">
      {Object.values(problems).map((problem, index, list) => (
        <Fragment key={problem.id}>
          <article className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-4">
            <h3 className="text-lg font-medium text-slate-100">{problem.title}</h3>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{problem.subtitle}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{problem.summary}</p>
            <p className="mt-3 text-xs text-slate-500">
              <span className="font-semibold text-slate-300">Reduction insight:</span> {problem.reductionHint}
            </p>
          </article>
          {index < list.length - 1 ? (
            <p className="text-center text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
              ↓ reduces ↓
            </p>
          ) : null}
        </Fragment>
      ))}
    </div>

    <FormulaAnimation />
  </section>
)

export default InfoPanel
