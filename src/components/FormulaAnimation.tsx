import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'

// Transformation steps for each reduction method
const tseitinSteps = [
  {
    id: 0,
    title: 'Original Formula',
    formula: '(A ∨ B) ∧ (¬C ∨ D ∨ E ∨ F)',
    description: 'Start with arbitrary SAT formula with clauses of varying sizes.',
    highlight: 'clause-2',
  },
  {
    id: 1,
    title: 'Identify Long Clause',
    formula: '(A ∨ B) ∧ (¬C ∨ D ∨ E ∨ F)',
    description: 'The second clause has 4 literals - needs conversion to 3-CNF.',
    highlight: 'long-clause',
  },
  {
    id: 2,
    title: 'Introduce Helper Variable',
    formula: '(A ∨ B) ∧ (¬C ∨ D ∨ x₁) ∧ (¬x₁ ∨ E ∨ F)',
    description: 'Split using new variable x₁. Break 4-literal clause into two 3-literal clauses.',
    highlight: 'gadget',
  },
  {
    id: 3,
    title: '3-CNF Result',
    formula: '(A ∨ B ∨ ⊤) ∧ (¬C ∨ D ∨ x₁) ∧ (¬x₁ ∨ E ∨ F)',
    description: 'All clauses now have exactly 3 literals. Satisfiability preserved.',
    highlight: 'success',
  },
] as const

const clausePaddingSteps = [
  {
    id: 0,
    title: 'Original Formula',
    formula: '(A) ∧ (B ∨ C) ∧ (D ∨ E ∨ F)',
    description: 'Formula with clauses shorter than 3 literals.',
    highlight: 'clause-2',
  },
  {
    id: 1,
    title: 'Identify Short Clauses',
    formula: '(A) ∧ (B ∨ C) ∧ (D ∨ E ∨ F)',
    description: 'First clause has 1 literal, second has 2 literals. Need padding to reach 3.',
    highlight: 'long-clause',
  },
  {
    id: 2,
    title: 'Add Dummy Variable',
    formula: '(A ∨ y ∨ ¬y) ∧ (B ∨ C ∨ z) ∧ (D ∨ E ∨ F)',
    description: 'Add dummy variable y and its negation to clause 1. Add new variable z to clause 2.',
    highlight: 'gadget',
  },
  {
    id: 3,
    title: '3-CNF Result',
    formula: '(A ∨ y ∨ ¬y) ∧ (B ∨ C ∨ z) ∧ (D ∨ E ∨ F)',
    description: 'All clauses padded to exactly 3 literals. Original satisfiability preserved.',
    highlight: 'success',
  },
] as const

const gadgetConstructionSteps = [
  {
    id: 0,
    title: 'Original Formula',
    formula: '(A ∧ B) ∨ C',
    description: 'Formula with nested structure - not in CNF form yet.',
    highlight: 'clause-2',
  },
  {
    id: 1,
    title: 'Identify Nested Structure',
    formula: '(A ∧ B) ∨ C',
    description: 'The subformula (A ∧ B) is nested within a disjunction.',
    highlight: 'long-clause',
  },
  {
    id: 2,
    title: 'Create Gadget Variable',
    formula: 'g₁ ≡ (A ∧ B), then (g₁ ∨ C)',
    description: 'Introduce gadget variable g₁ to represent the subformula.',
    highlight: 'gadget',
  },
  {
    id: 3,
    title: 'Expand Gadget to CNF',
    formula: '(g₁ ∨ ¬A ∨ ¬B) ∧ (¬g₁ ∨ A) ∧ (¬g₁ ∨ B) ∧ (g₁ ∨ C ∨ ⊤)',
    description: 'Express g₁ ≡ (A ∧ B) as clauses, then combine with main formula.',
    highlight: 'gadget',
  },
  {
    id: 4,
    title: '3-CNF Result',
    formula: '(g₁ ∨ ¬A ∨ ¬B) ∧ (¬g₁ ∨ A ∨ ⊤) ∧ (¬g₁ ∨ B ∨ ⊤) ∧ (g₁ ∨ C ∨ ⊤)',
    description: 'Formula converted to 3-CNF using gadget encoding.',
    highlight: 'success',
  },
] as const

const transformationStepsMap = {
  tseitin: tseitinSteps,
  'clause-padding': clausePaddingSteps,
  'gadget-construction': gadgetConstructionSteps,
}

type ReductionPath = 'tseitin' | 'clause-padding' | 'gadget-construction'

const pathDescriptions: Record<ReductionPath, string> = {
  tseitin: 'Tseitin Transformation - splits long clauses with helper variables',
  'clause-padding': 'Clause Padding - adds dummy literals to short clauses',
  'gadget-construction': 'Gadget Construction - creates equivalent 3-SAT gadgets',
}

const FormulaAnimation = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedPath, setSelectedPath] = useState<ReductionPath>('tseitin')
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [customFormula, setCustomFormula] = useState('(A ∨ B) ∧ (¬C ∨ D ∨ E ∨ F)')
  const [showGadgetGraph, setShowGadgetGraph] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1) // Default 1x speed
  const autoPlayInterval = useRef<number | null>(null)

  const transformationSteps = transformationStepsMap[selectedPath]
  const step = transformationSteps[currentStep]

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayInterval.current = window.setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < transformationSteps.length - 1) {
            return prev + 1
          } else {
            setIsAutoPlaying(false)
            return prev
          }
        })
      }, 2000 / playbackSpeed) // Adjust interval based on playback speed
    }

    return () => {
      if (autoPlayInterval.current) {
        clearInterval(autoPlayInterval.current)
      }
    }
  }, [isAutoPlaying, playbackSpeed])

  const handleNext = () => {
    if (currentStep < transformationSteps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleReset = () => {
    setCurrentStep(0)
    setIsAutoPlaying(false)
  }

  const toggleAutoPlay = () => {
    if (currentStep === transformationSteps.length - 1) {
      setCurrentStep(0)
    }
    setIsAutoPlaying(!isAutoPlaying)
  }

  const handleCustomFormulaSubmit = () => {
    import('../utils/formulaParser').then(({ parseFormula, transformTo3CNF, formulaToString, validateFormula }) => {
      // Validate formula
      const validation = validateFormula(customFormula)
      if (!validation.valid) {
        alert(`Error: ${validation.error}\n\nPlease check your formula and try again.`)
        return
      }

      try {
        // Parse the formula
        const parsed = parseFormula(customFormula)
        
        // Map UI path names to parser method names
        const methodMap: Record<ReductionPath, 'tseitin' | 'split' | 'padding'> = {
          'tseitin': 'tseitin',
          'clause-padding': 'padding',
          'gadget-construction': 'split'
        }
        
        // Transform to 3-CNF using the selected method
        const { formula: transformed, steps: transformSteps } = transformTo3CNF(parsed, methodMap[selectedPath])

        // Show results in alert with detailed steps
        const resultMessage = `
✅ Successfully transformed your formula!

Original:
${customFormula}

Transformed to 3-CNF:
${formulaToString(transformed)}

Transformation Steps:
${transformSteps.map((step: string, i: number) => `${i + 1}. ${step}`).join('\n')}

Method used: ${pathDescriptions[selectedPath]}
        `.trim()

        alert(resultMessage)
        setShowCustomInput(false)
        setCurrentStep(0)
      } catch (error) {
        alert(`Error parsing formula: ${error instanceof Error ? error.message : 'Unknown error'}\n\nPlease check your syntax and try again.`)
      }
    }).catch((error) => {
      alert(`Failed to load parser: ${error instanceof Error ? error.message : 'Unknown error'}`)
    })
  }

  const getHighlightColor = () => {
    switch (step.highlight) {
      case 'long-clause':
        return 'from-amber-500/20 to-orange-500/20 border-amber-500/40'
      case 'gadget':
        return 'from-cyan-500/20 to-blue-500/20 border-cyan-500/40'
      case 'success':
        return 'from-emerald-500/20 to-green-500/20 border-emerald-500/40'
      default:
        return 'from-slate-700/20 to-slate-800/20 border-slate-700/40'
    }
  }

  return (
    <div className="space-y-4 rounded-2xl border border-slate-800/60 bg-slate-900/60 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
          Interactive Transformation
        </h3>
        
        {/* Path selector */}
        <select
          value={selectedPath}
          onChange={(e) => {
            setSelectedPath(e.target.value as ReductionPath)
            setCurrentStep(0)
            setIsAutoPlaying(false)
          }}
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 outline-none transition-colors hover:border-slate-600 focus:border-slate-500"
        >
          <option value="tseitin">Tseitin Transform</option>
          <option value="clause-padding">Clause Padding</option>
          <option value="gadget-construction">Gadget Construction</option>
        </select>
      </div>

      <p className="text-xs text-slate-400">{pathDescriptions[selectedPath]}</p>

      {/* Formula display with animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className={`rounded-xl border bg-linear-to-br p-4 ${getHighlightColor()}`}
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Step {step.id + 1} of {transformationSteps.length}
            </span>
            <span className="rounded-full bg-slate-800/60 px-2 py-0.5 text-xs font-semibold text-slate-300">
              {step.title}
            </span>
          </div>
          
          <div className="font-mono text-base text-slate-100 sm:text-lg">
            {step.formula}
          </div>
          
          <p className="mt-3 text-xs leading-relaxed text-slate-400">
            {step.description}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Progress indicator */}
      <div className="flex gap-1.5">
        {transformationSteps.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrentStep(idx)}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              idx === currentStep
                ? 'bg-cyan-500'
                : idx < currentStep
                  ? 'bg-slate-600'
                  : 'bg-slate-800'
            }`}
            aria-label={`Go to step ${idx + 1}`}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={handlePrev}
          disabled={currentStep === 0 || isAutoPlaying}
          className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-medium text-slate-200 transition-all hover:border-slate-600 hover:bg-slate-750 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-700 disabled:hover:bg-slate-800"
        >
          ← Previous
        </button>
        
        <button
          onClick={handleNext}
          disabled={currentStep === transformationSteps.length - 1 || isAutoPlaying}
          className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-medium text-slate-200 transition-all hover:border-slate-600 hover:bg-slate-750 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-700 disabled:hover:bg-slate-800"
        >
          Next →
        </button>

        <button
          onClick={toggleAutoPlay}
          className={`rounded-lg border px-4 py-2 text-xs font-medium transition-all ${
            isAutoPlaying
              ? 'border-amber-500/60 bg-amber-500/20 text-amber-200 hover:bg-amber-500/30'
              : 'border-slate-700 bg-slate-800 text-slate-200 hover:border-slate-600 hover:bg-slate-750'
          }`}
        >
          {isAutoPlaying ? '⏸ Pause' : '▶ Auto-play'}
        </button>

        {/* Speed Control */}
        <select
          value={playbackSpeed}
          onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-200 transition-all hover:border-slate-600 hover:bg-slate-750 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
          title="Playback Speed"
        >
          <option value={0.25}>0.25× Speed</option>
          <option value={0.5}>0.5× Speed</option>
          <option value={0.75}>0.75× Speed</option>
          <option value={1}>1× Speed</option>
          <option value={1.25}>1.25× Speed</option>
          <option value={1.5}>1.5× Speed</option>
          <option value={1.75}>1.75× Speed</option>
          <option value={2}>2× Speed</option>
        </select>

        <button
          onClick={handleReset}
          disabled={isAutoPlaying}
          className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-medium text-slate-200 transition-all hover:border-slate-600 hover:bg-slate-750 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ↺ Reset
        </button>

        <button
          onClick={() => setShowGadgetGraph(!showGadgetGraph)}
          className="ml-auto rounded-lg border border-purple-500/40 bg-purple-500/10 px-4 py-2 text-xs font-medium text-purple-200 transition-all hover:border-purple-500/60 hover:bg-purple-500/20"
        >
          {showGadgetGraph ? '📝 Formula View' : '🕸️ Graph View'}
        </button>
      </div>

      {/* Gadget Graph Visualization */}
      <AnimatePresence>
        {showGadgetGraph && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl border border-purple-500/30 bg-purple-500/5 p-5">
              <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-purple-300">
                <span>🕸️</span>
                3-CNF → CLIQUE Gadget Construction
              </h4>
              
              <div className="space-y-4 text-sm text-slate-300">
                <p className="leading-relaxed">
                  For formula: <span className="font-mono text-purple-200">(A ∨ B ∨ ⊤) ∧ (¬C ∨ D ∨ x₁) ∧ (¬x₁ ∨ E ∨ F)</span>
                </p>
                
                {/* Graph representation */}
                <div className="rounded-xl border border-purple-500/20 bg-slate-900/60 p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-purple-400">Graph Structure:</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-xs font-bold text-blue-300">
                        C1
                      </div>
                      <div className="text-xs">
                        <p className="font-semibold text-slate-200">Clause 1 vertices:</p>
                        <p className="text-slate-400">v₁=A, v₂=B, v₃=⊤</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-xs font-bold text-cyan-300">
                        C2
                      </div>
                      <div className="text-xs">
                        <p className="font-semibold text-slate-200">Clause 2 vertices:</p>
                        <p className="text-slate-400">v₄=¬C, v₅=D, v₆=x₁</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-xs font-bold text-purple-300">
                        C3
                      </div>
                      <div className="text-xs">
                        <p className="font-semibold text-slate-200">Clause 3 vertices:</p>
                        <p className="text-slate-400">v₇=¬x₁, v₈=E, v₉=F</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-lg border border-dashed border-purple-500/30 bg-purple-500/5 p-3 text-xs text-purple-200">
                    <p className="font-semibold">Edge Rule:</p>
                    <p className="mt-1 text-purple-300/80">
                      Connect vertices if: (1) from different clauses, AND (2) not contradictory (e.g., A and ¬A)
                    </p>
                    <p className="mt-2 font-semibold">Goal:</p>
                    <p className="text-purple-300/80">
                      Find k-clique (k=3) → One vertex from each clause that are all compatible → Satisfying assignment!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CLIQUE Graph Visualization */}
      <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-purple-300">
            🕸️ CLIQUE Graph Construction (Gadget Method)
          </h4>
          <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-xs font-medium text-purple-300">
            Visual Example
          </span>
        </div>

        <div className="rounded-lg border border-purple-500/20 bg-slate-900/60 p-4">
          <p className="mb-3 text-xs text-slate-400">
            Formula: <span className="font-mono text-purple-300">(A ∨ B ∨ ⊤) ∧ (¬C ∨ D ∨ x₁) ∧ (¬x₁ ∨ E ∨ F)</span>
          </p>

          {/* SVG Graph */}
          <svg viewBox="0 0 400 300" className="w-full" style={{ maxHeight: '300px' }}>
            {/* Define gradient for edges */}
            <defs>
              <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#8b5cf6', stopOpacity: 0.3 }} />
                <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 0.6 }} />
              </linearGradient>
            </defs>

            {/* Edges - connecting compatible vertices from different clauses */}
            {/* Clause 1 to Clause 2 edges */}
            <line x1="60" y1="80" x2="200" y2="80" stroke="url(#edgeGradient)" strokeWidth="1.5" opacity="0.5" />
            <line x1="60" y1="80" x2="200" y2="150" stroke="url(#edgeGradient)" strokeWidth="1.5" opacity="0.5" />
            <line x1="60" y1="80" x2="240" y2="220" stroke="url(#edgeGradient)" strokeWidth="1.5" opacity="0.5" />
            <line x1="100" y1="140" x2="200" y2="80" stroke="url(#edgeGradient)" strokeWidth="1.5" opacity="0.5" />
            <line x1="100" y1="140" x2="200" y2="150" stroke="url(#edgeGradient)" strokeWidth="1.5" opacity="0.5" />
            <line x1="100" y1="140" x2="240" y2="220" stroke="url(#edgeGradient)" strokeWidth="1.5" opacity="0.5" />
            <line x1="140" y1="80" x2="200" y2="80" stroke="url(#edgeGradient)" strokeWidth="1.5" opacity="0.5" />
            <line x1="140" y1="80" x2="200" y2="150" stroke="url(#edgeGradient)" strokeWidth="1.5" opacity="0.5" />
            <line x1="140" y1="80" x2="240" y2="220" stroke="url(#edgeGradient)" strokeWidth="1.5" opacity="0.5" />
            
            {/* Clause 2 to Clause 3 edges (note: x₁ and ¬x₁ are contradictory, so no edge between them) */}
            <line x1="200" y1="80" x2="300" y2="150" stroke="url(#edgeGradient)" strokeWidth="1.5" opacity="0.5" />
            <line x1="200" y1="80" x2="340" y2="80" stroke="url(#edgeGradient)" strokeWidth="1.5" opacity="0.5" />
            <line x1="200" y1="150" x2="300" y2="150" stroke="url(#edgeGradient)" strokeWidth="1.5" opacity="0.5" />
            <line x1="200" y1="150" x2="340" y2="80" stroke="url(#edgeGradient)" strokeWidth="1.5" opacity="0.5" />
            <line x1="240" y1="220" x2="340" y2="80" stroke="url(#edgeGradient)" strokeWidth="1.5" opacity="0.5" />
            <line x1="240" y1="220" x2="380" y2="140" stroke="url(#edgeGradient)" strokeWidth="1.5" opacity="0.5" />
            
            {/* Clause 1 to Clause 3 edges */}
            <line x1="60" y1="80" x2="300" y2="150" stroke="url(#edgeGradient)" strokeWidth="1.5" opacity="0.5" />
            <line x1="60" y1="80" x2="340" y2="80" stroke="url(#edgeGradient)" strokeWidth="1.5" opacity="0.5" />
            <line x1="60" y1="80" x2="380" y2="140" stroke="url(#edgeGradient)" strokeWidth="1.5" opacity="0.5" />
            <line x1="100" y1="140" x2="300" y2="150" stroke="url(#edgeGradient)" strokeWidth="1.5" opacity="0.5" />
            <line x1="100" y1="140" x2="340" y2="80" stroke="url(#edgeGradient)" strokeWidth="1.5" opacity="0.5" />
            <line x1="100" y1="140" x2="380" y2="140" stroke="url(#edgeGradient)" strokeWidth="1.5" opacity="0.5" />
            <line x1="140" y1="80" x2="300" y2="150" stroke="url(#edgeGradient)" strokeWidth="1.5" opacity="0.5" />
            <line x1="140" y1="80" x2="340" y2="80" stroke="url(#edgeGradient)" strokeWidth="1.5" opacity="0.5" />
            <line x1="140" y1="80" x2="380" y2="140" stroke="url(#edgeGradient)" strokeWidth="1.5" opacity="0.5" />

            {/* Clause 1 vertices: (A ∨ B ∨ ⊤) */}
            <g>
              <circle cx="60" cy="80" r="18" fill="#3b82f6" fillOpacity="0.3" stroke="#3b82f6" strokeWidth="2" />
              <text x="60" y="85" textAnchor="middle" fill="#93c5fd" fontSize="12" fontWeight="bold">A</text>
              <text x="60" y="110" textAnchor="middle" fill="#60a5fa" fontSize="9">C1</text>
            </g>
            <g>
              <circle cx="100" cy="140" r="18" fill="#3b82f6" fillOpacity="0.3" stroke="#3b82f6" strokeWidth="2" />
              <text x="100" y="145" textAnchor="middle" fill="#93c5fd" fontSize="12" fontWeight="bold">B</text>
              <text x="100" y="170" textAnchor="middle" fill="#60a5fa" fontSize="9">C1</text>
            </g>
            <g>
              <circle cx="140" cy="80" r="18" fill="#3b82f6" fillOpacity="0.3" stroke="#3b82f6" strokeWidth="2" />
              <text x="140" y="85" textAnchor="middle" fill="#93c5fd" fontSize="12" fontWeight="bold">⊤</text>
              <text x="140" y="110" textAnchor="middle" fill="#60a5fa" fontSize="9">C1</text>
            </g>

            {/* Clause 2 vertices: (¬C ∨ D ∨ x₁) */}
            <g>
              <circle cx="200" cy="80" r="18" fill="#06b6d4" fillOpacity="0.3" stroke="#06b6d4" strokeWidth="2" />
              <text x="200" y="85" textAnchor="middle" fill="#67e8f9" fontSize="12" fontWeight="bold">¬C</text>
              <text x="200" y="110" textAnchor="middle" fill="#22d3ee" fontSize="9">C2</text>
            </g>
            <g>
              <circle cx="200" cy="150" r="18" fill="#06b6d4" fillOpacity="0.3" stroke="#06b6d4" strokeWidth="2" />
              <text x="200" y="155" textAnchor="middle" fill="#67e8f9" fontSize="12" fontWeight="bold">D</text>
              <text x="200" y="180" textAnchor="middle" fill="#22d3ee" fontSize="9">C2</text>
            </g>
            <g>
              <circle cx="240" cy="220" r="18" fill="#06b6d4" fillOpacity="0.3" stroke="#06b6d4" strokeWidth="2" />
              <text x="240" y="225" textAnchor="middle" fill="#67e8f9" fontSize="11" fontWeight="bold">x₁</text>
              <text x="240" y="250" textAnchor="middle" fill="#22d3ee" fontSize="9">C2</text>
            </g>

            {/* Clause 3 vertices: (¬x₁ ∨ E ∨ F) */}
            <g>
              <circle cx="300" cy="150" r="18" fill="#a855f7" fillOpacity="0.3" stroke="#a855f7" strokeWidth="2" />
              <text x="300" y="155" textAnchor="middle" fill="#d8b4fe" fontSize="11" fontWeight="bold">¬x₁</text>
              <text x="300" y="180" textAnchor="middle" fill="#c084fc" fontSize="9">C3</text>
            </g>
            <g>
              <circle cx="340" cy="80" r="18" fill="#a855f7" fillOpacity="0.3" stroke="#a855f7" strokeWidth="2" />
              <text x="340" y="85" textAnchor="middle" fill="#d8b4fe" fontSize="12" fontWeight="bold">E</text>
              <text x="340" y="110" textAnchor="middle" fill="#c084fc" fontSize="9">C3</text>
            </g>
            <g>
              <circle cx="380" cy="140" r="18" fill="#a855f7" fillOpacity="0.3" stroke="#a855f7" strokeWidth="2" />
              <text x="380" y="145" textAnchor="middle" fill="#d8b4fe" fontSize="12" fontWeight="bold">F</text>
              <text x="380" y="170" textAnchor="middle" fill="#c084fc" fontSize="9">C3</text>
            </g>

            {/* Highlight a 3-clique example: {B, D, E} */}
            <g opacity="0.8">
              <circle cx="100" cy="140" r="22" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="4,2">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="200" cy="150" r="22" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="4,2">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="340" cy="80" r="22" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="4,2">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
              </circle>
            </g>
          </svg>

          {/* Legend */}
          <div className="mt-4 space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500 ring-2 ring-blue-500/30"></div>
              <span className="text-slate-400">Clause 1 (C1): <span className="font-mono text-blue-300">A ∨ B ∨ ⊤</span></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-cyan-500 ring-2 ring-cyan-500/30"></div>
              <span className="text-slate-400">Clause 2 (C2): <span className="font-mono text-cyan-300">¬C ∨ D ∨ x₁</span></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-purple-500 ring-2 ring-purple-500/30"></div>
              <span className="text-slate-400">Clause 3 (C3): <span className="font-mono text-purple-300">¬x₁ ∨ E ∨ F</span></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full border-2 border-amber-400 border-dashed"></div>
              <span className="text-amber-300 font-semibold">3-Clique Found: {'{B, D, E}'} → Formula is satisfiable!</span>
            </div>
            <div className="mt-2 flex items-center gap-2 rounded bg-slate-800/50 p-2">
              <span className="text-xs text-slate-500">⚠️</span>
              <span className="text-slate-400">Note: x₁ and ¬x₁ are contradictory, so no edge connects them</span>
            </div>
          </div>

          <div className="mt-3 rounded-lg border border-purple-500/30 bg-purple-500/5 p-2 text-xs text-purple-200">
            <p className="font-semibold">💡 Key Insight:</p>
            <p className="mt-1 text-purple-300/80">
              Edges connect vertices from different clauses that are compatible (not contradictory). 
              Finding a k-clique (k=3) means finding one satisfying literal from each clause!
            </p>
          </div>
        </div>
      </div>

      {/* Custom Formula Input */}
      <div className="space-y-2">
        <button
          onClick={() => setShowCustomInput(!showCustomInput)}
          className="w-full rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-2 text-left text-xs font-medium text-slate-300 transition-all hover:border-slate-600 hover:bg-slate-800"
        >
          {showCustomInput ? '▼' : '▶'} Try Your Own Formula
        </button>

        <AnimatePresence>
          {showCustomInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="space-y-3 rounded-xl border border-slate-700/60 bg-slate-900/60 p-4">
                <div>
                  <p className="mb-2 text-xs font-semibold text-cyan-400">📝 How to Use:</p>
                  <ul className="space-y-1 text-xs text-slate-400">
                    <li>• Write formulas in CNF (clauses joined by ∧)</li>
                    <li>• Each clause: literals joined by ∨</li>
                    <li>• Use ¬ for negation</li>
                    <li>• Variables: A-Z (uppercase)</li>
                  </ul>
                </div>

                <div className="rounded-lg border border-slate-700/40 bg-slate-800/40 p-2">
                  <p className="mb-1 text-xs font-medium text-slate-400">Try these examples:</p>
                  <div className="space-y-1">
                    {[
                      '(A ∨ B) ∧ (¬C ∨ D ∨ E)',
                      '(A) ∧ (B ∨ C)',
                      '(A ∨ B ∨ C ∨ D) ∧ (¬E ∨ F)',
                    ].map((example, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCustomFormula(example)}
                        className="block w-full rounded border border-slate-700/50 bg-slate-800/60 px-2 py-1 text-left text-xs text-slate-300 transition-colors hover:border-cyan-500/40 hover:bg-slate-750"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="block">
                  <span className="mb-2 block text-xs font-medium text-slate-300">Your Formula:</span>
                  <input
                    type="text"
                    value={customFormula}
                    onChange={(e) => setCustomFormula(e.target.value)}
                    placeholder="(A ∨ B) ∧ (¬C ∨ D ∨ E)"
                    className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Symbols: ∨ (or), ∧ (and), ¬ (not), ( ) for grouping
                  </p>
                </label>

                <button
                  onClick={handleCustomFormulaSubmit}
                  disabled={!customFormula.trim()}
                  className="w-full rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-xs font-medium text-cyan-200 transition-all hover:border-cyan-500/60 hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-cyan-500/40 disabled:hover:bg-cyan-500/10"
                >
                  Transform to 3-CNF using {pathDescriptions[selectedPath]}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default FormulaAnimation
