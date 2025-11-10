import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

type Literal = {
  id: string
  variable: string
  negated: boolean
  clauseIndex: number
  position: { x: number; y: number }
}

type Edge = {
  from: string
  to: string
}

type CliqueGraphAnimationProps = {
  formula?: string
  isAnimating?: boolean
  animationStep?: number
  exampleFormula?: string
}

const parseFormulaToGraph = (formula: string): { literals: Literal[]; edges: Edge[] } => {
  const literals: Literal[] = []
  const edges: Edge[] = []
  
  // Parse formula: (A ∨ B ∨ ⊤) ∧ (¬C ∨ D ∨ x₁) ∧ (¬x₁ ∨ E ∨ F)
  const clauses = formula.split('∧').map(c => c.trim().replace(/[()]/g, ''))
  
  const positions = [
    [{ x: 60, y: 80 }, { x: 100, y: 140 }, { x: 140, y: 80 }],
    [{ x: 200, y: 80 }, { x: 200, y: 150 }, { x: 240, y: 220 }],
    [{ x: 300, y: 150 }, { x: 340, y: 80 }, { x: 380, y: 140 }],
  ]
  
  clauses.forEach((clause, clauseIdx) => {
    const lits = clause.split('∨').map(l => l.trim())
    lits.forEach((lit, litIdx) => {
      const negated = lit.startsWith('¬')
      const variable = negated ? lit.substring(1) : lit
      literals.push({
        id: `c${clauseIdx}-l${litIdx}`,
        variable,
        negated,
        clauseIndex: clauseIdx,
        position: positions[clauseIdx]?.[litIdx] || { x: 200, y: 150 }
      })
    })
  })
  
  // Generate edges: connect literals from different clauses that are compatible
  for (let i = 0; i < literals.length; i++) {
    for (let j = i + 1; j < literals.length; j++) {
      const lit1 = literals[i]
      const lit2 = literals[j]
      
      // Different clauses and not contradictory
      if (lit1.clauseIndex !== lit2.clauseIndex) {
        const isContradictory = lit1.variable === lit2.variable && lit1.negated !== lit2.negated
        if (!isContradictory) {
          edges.push({ from: lit1.id, to: lit2.id })
        }
      }
    }
  }
  
  return { literals, edges }
}

const CliqueGraphAnimation = ({ 
  formula = '(A ∨ B ∨ ⊤) ∧ (¬C ∨ D ∨ x₁) ∧ (¬x₁ ∨ E ∨ F)',
  isAnimating = false,
  animationStep = 0,
  exampleFormula
}: CliqueGraphAnimationProps) => {
  const [showVertices, setShowVertices] = useState<number>(0)
  const [showEdges, setShowEdges] = useState<number>(0)
  const [highlightClique, setHighlightClique] = useState(false)
  const [graphSpeed, setGraphSpeed] = useState(1) // Speed for graph animation
  const [isGraphAnimating, setIsGraphAnimating] = useState(false)
  const [customInput, setCustomInput] = useState(exampleFormula || formula)

  const { literals, edges } = parseFormulaToGraph(customInput)
  
  const clauseColors = ['#3b82f6', '#06b6d4', '#a855f7']
  const clauseNames = ['C1', 'C2', 'C3']

  // Update customInput when exampleFormula changes
  useEffect(() => {
    if (exampleFormula) {
      setCustomInput(exampleFormula)
      setShowVertices(0)
      setShowEdges(0)
      setHighlightClique(false)
      setIsGraphAnimating(false)
    }
  }, [exampleFormula])

  // Independent animation for graph construction
  useEffect(() => {
    if (isGraphAnimating) {
      setShowVertices(0)
      setShowEdges(0)
      setHighlightClique(false)
      
      // Animate vertices
      let count = 0
      const vertexInterval = setInterval(() => {
        count++
        setShowVertices(count)
        if (count >= literals.length) {
          clearInterval(vertexInterval)
          
          // Start edge animation after vertices complete
          setTimeout(() => {
            let edgeCount = 0
            const edgeInterval = setInterval(() => {
              edgeCount += 3
              setShowEdges(Math.min(edgeCount, edges.length))
              if (edgeCount >= edges.length) {
                clearInterval(edgeInterval)
                
                // Highlight clique after edges complete
                setTimeout(() => {
                  setHighlightClique(true)
                  setIsGraphAnimating(false)
                }, 500 / graphSpeed)
              }
            }, 200 / graphSpeed)
          }, 500 / graphSpeed)
        }
      }, 300 / graphSpeed)
      
      return () => {
        clearInterval(vertexInterval)
      }
    }
  }, [isGraphAnimating, literals.length, edges.length, graphSpeed])

  // Sync with main animation steps
  useEffect(() => {
    if (isAnimating) {
      // Step 0-1: Show formula and prepare
      if (animationStep <= 1) {
        setShowVertices(0)
        setShowEdges(0)
        setHighlightClique(false)
      }
      // Step 2: Start showing vertices gradually
      else if (animationStep === 2) {
        const timer = setTimeout(() => {
          let count = 0
          const interval = setInterval(() => {
            count++
            setShowVertices(count)
            if (count >= literals.length) {
              clearInterval(interval)
            }
          }, 300)
          return () => clearInterval(interval)
        }, 500)
        return () => clearTimeout(timer)
      }
      // Step 3: Show edges gradually
      else if (animationStep === 3) {
        setShowVertices(literals.length)
        const timer = setTimeout(() => {
          let count = 0
          const interval = setInterval(() => {
            count += 3
            setShowEdges(Math.min(count, edges.length))
            if (count >= edges.length) {
              clearInterval(interval)
            }
          }, 200)
          return () => clearInterval(interval)
        }, 500)
        return () => clearTimeout(timer)
      }
      // Step 4: Highlight clique
      else if (animationStep >= 4) {
        setShowVertices(literals.length)
        setShowEdges(edges.length)
        setHighlightClique(true)
      }
    }
  }, [isAnimating, animationStep, literals.length, edges.length])

  // Find a valid 3-clique (one from each clause that are all connected)
  const findClique = (): string[] => {
    // Simple heuristic: pick first literal from each clause that forms a clique
    const clauseGroups = [
      literals.filter(l => l.clauseIndex === 0),
      literals.filter(l => l.clauseIndex === 1),
      literals.filter(l => l.clauseIndex === 2),
    ]
    
    for (const l1 of clauseGroups[0] || []) {
      for (const l2 of clauseGroups[1] || []) {
        for (const l3 of clauseGroups[2] || []) {
          // Check if all pairs are connected
          const hasEdge12 = edges.some(e => 
            (e.from === l1.id && e.to === l2.id) || (e.from === l2.id && e.to === l1.id))
          const hasEdge13 = edges.some(e => 
            (e.from === l1.id && e.to === l3.id) || (e.from === l3.id && e.to === l1.id))
          const hasEdge23 = edges.some(e => 
            (e.from === l2.id && e.to === l3.id) || (e.from === l3.id && e.to === l2.id))
          
          if (hasEdge12 && hasEdge13 && hasEdge23) {
            return [l1.id, l2.id, l3.id]
          }
        }
      }
    }
    return []
  }

  const cliqueNodes = findClique()

  const startGraphAnimation = () => {
    setIsGraphAnimating(true)
  }

  const resetGraph = () => {
    setShowVertices(0)
    setShowEdges(0)
    setHighlightClique(false)
    setIsGraphAnimating(false)
  }

  const showFullGraph = () => {
    setShowVertices(literals.length)
    setShowEdges(edges.length)
    setHighlightClique(true)
    setIsGraphAnimating(false)
  }

  return (
    <div className="space-y-4">
      {/* Animation Controls */}
      <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-cyan-300">
            🎬 Graph Animation Controls
          </h4>
        </div>

        {/* Speed Control Slider */}
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs font-medium text-cyan-300">Animation Speed</label>
            <span className="rounded-full bg-cyan-500/20 px-2 py-1 text-xs font-mono text-cyan-200">
              {graphSpeed.toFixed(2)}x
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={graphSpeed}
            onChange={(e) => setGraphSpeed(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer 
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
              [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full 
              [&::-webkit-slider-thumb]:bg-cyan-500 [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-cyan-500/50
              [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-110
              [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 
              [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-cyan-500 
              [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer
              [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:shadow-cyan-500/50
              [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:hover:scale-110"
          />
          <div className="mt-1 flex justify-between text-xs text-cyan-400/60">
            <span>0.1x (Very Slow)</span>
            <span>1x</span>
            <span>3x (Very Fast)</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-2">
          <button
            onClick={startGraphAnimation}
            disabled={isGraphAnimating}
            className="flex-1 rounded-lg bg-cyan-500 px-3 py-2 text-sm font-medium text-white 
              transition-all hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGraphAnimating ? '⏳ Animating...' : '▶ Animate Graph'}
          </button>
          <button
            onClick={resetGraph}
            className="rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm 
              font-medium text-slate-200 transition-all hover:bg-slate-600"
          >
            🔄 Reset
          </button>
          <button
            onClick={showFullGraph}
            className="rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm 
              font-medium text-slate-200 transition-all hover:bg-slate-600"
          >
            ⏩ Show All
          </button>
        </div>
      </div>

      {/* Formula Input */}
      <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-4">
        <div className="mb-3">
          <h4 className="text-sm font-semibold text-purple-300">📝 Custom Formula</h4>
        </div>

        <div className="space-y-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="(A ∨ B ∨ C) ∧ (¬A ∨ ¬B ∨ D) ∧ (¬C ∨ D ∨ E)"
            className="w-full rounded-lg border border-purple-500/30 bg-slate-900/50 px-3 py-2 
              font-mono text-sm text-purple-200 placeholder:text-purple-400/40 
              focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
          <button
            onClick={resetGraph}
            className="w-full rounded-lg bg-purple-600 px-3 py-2 text-sm font-medium 
              text-white transition-all hover:bg-purple-700"
          >
            🔄 Apply & Reset Graph
          </button>
          <p className="text-xs text-purple-300/70">
            Use ∨ for OR, ∧ for AND, ¬ for NOT. Each clause should have 3 literals.
          </p>
        </div>

        <div className="mt-3 rounded-lg bg-slate-900/50 p-3">
          <p className="text-xs font-semibold text-purple-400 mb-1">Current Formula:</p>
          <p className="font-mono text-sm text-purple-200">{customInput}</p>
        </div>
      </div>

      {/* Graph Visualization */}
      <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-purple-300">
            🕸️ CLIQUE Graph
          </h4>
          <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-xs font-medium text-purple-300">
            {showVertices}/{literals.length} vertices • {showEdges}/{edges.length} edges
          </span>
        </div>
      </div>

      <div className="rounded-lg border border-purple-500/20 bg-slate-900/60 p-4">
        <p className="mb-3 text-xs text-slate-400">
          Formula: <span className="font-mono text-purple-300">{formula}</span>
        </p>

        {/* SVG Graph */}
        <svg viewBox="0 0 400 300" className="w-full" style={{ maxHeight: '300px' }}>
          <defs>
            <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#64748b', stopOpacity: 0.8 }} />
              <stop offset="100%" style={{ stopColor: '#94a3b8', stopOpacity: 0.8 }} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Edges */}
          <AnimatePresence>
            {edges.slice(0, showEdges).map((edge, idx) => {
              const fromLit = literals.find(l => l.id === edge.from)
              const toLit = literals.find(l => l.id === edge.to)
              if (!fromLit || !toLit) return null

              const isCliqueEdge = highlightClique && 
                cliqueNodes.includes(edge.from) && 
                cliqueNodes.includes(edge.to)

              return (
                <motion.line
                  key={`${edge.from}-${edge.to}`}
                  x1={fromLit.position.x}
                  y1={fromLit.position.y}
                  x2={toLit.position.x}
                  y2={toLit.position.y}
                  stroke={isCliqueEdge ? '#fbbf24' : '#94a3b8'}
                  strokeWidth={isCliqueEdge ? 3 : 2}
                  opacity={isCliqueEdge ? 1 : 0.7}
                  filter={isCliqueEdge ? 'url(#glow)' : undefined}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: 1, 
                    opacity: isCliqueEdge ? 1 : 0.7,
                    strokeWidth: isCliqueEdge ? [3, 3.5, 3] : 2
                  }}
                  transition={{ 
                    pathLength: { duration: 0.5, delay: idx * 0.05 },
                    opacity: { duration: 0.3 },
                    strokeWidth: { duration: 1, repeat: isCliqueEdge ? Infinity : 0 }
                  }}
                />
              )
            })}
          </AnimatePresence>

          {/* Vertices */}
          <AnimatePresence>
            {literals.slice(0, showVertices).map((lit, idx) => {
              const color = clauseColors[lit.clauseIndex]
              const isInClique = highlightClique && cliqueNodes.includes(lit.id)

              return (
                <motion.g
                  key={lit.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    type: 'spring',
                    stiffness: 200,
                    damping: 15,
                    delay: idx * 0.1 
                  }}
                >
                  {/* Vertex circle */}
                  <motion.circle
                    cx={lit.position.x}
                    cy={lit.position.y}
                    r={18}
                    fill={color}
                    fillOpacity={0.3}
                    stroke={color}
                    strokeWidth={2}
                    animate={{
                      scale: isInClique ? [1, 1.1, 1] : 1,
                    }}
                    transition={{
                      duration: 1,
                      repeat: isInClique ? Infinity : 0,
                    }}
                  />
                  
                  {/* Clique highlight ring */}
                  {isInClique && (
                    <motion.circle
                      cx={lit.position.x}
                      cy={lit.position.y}
                      r={22}
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth={2.5}
                      strokeDasharray="4,2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}

                  {/* Variable label */}
                  <text
                    x={lit.position.x}
                    y={lit.position.y + 5}
                    textAnchor="middle"
                    fill={color === '#3b82f6' ? '#93c5fd' : color === '#06b6d4' ? '#67e8f9' : '#d8b4fe'}
                    fontSize={lit.variable.length > 1 ? 11 : 12}
                    fontWeight="bold"
                  >
                    {lit.negated ? '¬' : ''}{lit.variable}
                  </text>

                  {/* Clause label */}
                  <text
                    x={lit.position.x}
                    y={lit.position.y + 30}
                    textAnchor="middle"
                    fill={color}
                    fontSize={9}
                  >
                    {clauseNames[lit.clauseIndex]}
                  </text>
                </motion.g>
              )
            })}
          </AnimatePresence>
        </svg>

        {/* Legend */}
        <div className="mt-4 space-y-2 text-xs">
          {literals.length > 0 && (
            <>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500 ring-2 ring-blue-500/30"></div>
                <span className="text-slate-400">
                  Clause 1 (C1): <span className="font-mono text-blue-300">
                    {literals.filter(l => l.clauseIndex === 0).map(l => `${l.negated ? '¬' : ''}${l.variable}`).join(' ∨ ')}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-cyan-500 ring-2 ring-cyan-500/30"></div>
                <span className="text-slate-400">
                  Clause 2 (C2): <span className="font-mono text-cyan-300">
                    {literals.filter(l => l.clauseIndex === 1).map(l => `${l.negated ? '¬' : ''}${l.variable}`).join(' ∨ ')}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-purple-500 ring-2 ring-purple-500/30"></div>
                <span className="text-slate-400">
                  Clause 3 (C3): <span className="font-mono text-purple-300">
                    {literals.filter(l => l.clauseIndex === 2).map(l => `${l.negated ? '¬' : ''}${l.variable}`).join(' ∨ ')}
                  </span>
                </span>
              </div>
            </>
          )}
          {highlightClique && cliqueNodes.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full border-2 border-amber-400 border-dashed"></div>
              <span className="text-amber-300 font-semibold">
                {cliqueNodes.length}-Clique Found: {'{'}
                {cliqueNodes.map(id => {
                  const lit = literals.find(l => l.id === id)
                  return lit ? `${lit.negated ? '¬' : ''}${lit.variable}` : ''
                }).join(', ')}
                {'}'} → Satisfiable!
              </span>
            </div>
          )}
        </div>

        {/* Detailed Clique Explanation */}
        {highlightClique && cliqueNodes.length > 0 && (
          <div className="mt-4 rounded-lg border border-amber-500/40 bg-amber-950/30 p-4">
            <h5 className="text-sm font-bold text-amber-300 mb-3 flex items-center gap-2">
              <span>🎯</span>
              <span>Why This {cliqueNodes.length}-Clique Proves Satisfiability</span>
            </h5>
            
            <div className="space-y-3 text-xs">
              {/* The Clique */}
              <div className="rounded-lg bg-slate-900/50 p-3 border border-amber-500/20">
                <p className="text-amber-200 font-semibold mb-1">✅ Found Valid {cliqueNodes.length}-Clique:</p>
                <p className="font-mono text-amber-100 text-sm">
                  {'{'}
                  {cliqueNodes.map(id => {
                    const lit = literals.find(l => l.id === id)
                    return lit ? `${lit.negated ? '¬' : ''}${lit.variable}` : ''
                  }).join(', ')}
                  {'}'}
                </p>
              </div>

              {/* Why it's valid */}
              <div className="space-y-2">
                <p className="text-amber-300 font-semibold">🔍 Why This is a Valid Clique:</p>
                
                <div className="pl-3 space-y-1.5">
                  <div className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">1️⃣</span>
                    <div className="flex-1">
                      <p className="text-amber-200">One vertex from each clause:</p>
                      <div className="mt-1 space-y-0.5">
                        {cliqueNodes.map(id => {
                          const lit = literals.find(l => l.id === id)
                          if (!lit) return null
                          return (
                            <p key={id} className="text-amber-100/90 pl-2">
                              • <span className="font-mono">{lit.negated ? '¬' : ''}{lit.variable}</span> from <span className="font-semibold">Clause {lit.clauseIndex + 1}</span>
                            </p>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">2️⃣</span>
                    <div className="flex-1">
                      <p className="text-amber-200">All vertices are pairwise connected:</p>
                      <div className="mt-1 space-y-0.5">
                        {cliqueNodes.map((id1, i) => 
                          cliqueNodes.slice(i + 1).map(id2 => {
                            const lit1 = literals.find(l => l.id === id1)
                            const lit2 = literals.find(l => l.id === id2)
                            if (!lit1 || !lit2) return null
                            return (
                              <p key={`${id1}-${id2}`} className="text-green-200/90 pl-2">
                                • <span className="font-mono">{lit1.negated ? '¬' : ''}{lit1.variable}</span> ↔ <span className="font-mono">{lit2.negated ? '¬' : ''}{lit2.variable}</span> 
                                <span className="text-green-300/70"> (different clauses, not contradictory)</span>
                              </p>
                            )
                          })
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* What it means */}
              <div className="rounded-lg bg-green-950/30 border border-green-500/30 p-3">
                <p className="text-green-300 font-semibold mb-2">💡 What This Means:</p>
                <p className="text-green-200">
                  If we set{' '}
                  {cliqueNodes.map((id, idx) => {
                    const lit = literals.find(l => l.id === id)
                    if (!lit) return ''
                    return (
                      <span key={id}>
                        <span className="font-mono font-semibold">{lit.negated ? '¬' : ''}{lit.variable} = TRUE</span>
                        {idx < cliqueNodes.length - 1 ? ', ' : ''}
                      </span>
                    )
                  })}
                  , then all three clauses will be satisfied!
                </p>
                <p className="text-green-100 mt-2 font-semibold">
                  ✅ This proves the original 3-CNF formula is <span className="text-green-300">SATISFIABLE</span>.
                </p>
              </div>

              {/* Reduction meaning */}
              <div className="rounded-lg bg-blue-950/30 border border-blue-500/30 p-3">
                <p className="text-blue-300 font-semibold mb-1">🔗 Reduction Significance:</p>
                <p className="text-blue-200 text-xs leading-relaxed">
                  The existence of a k-clique (k=3) in this graph is <span className="font-semibold">equivalent</span> to the satisfiability 
                  of the 3-CNF formula. This proves that 3-SAT reduces to CLIQUE in polynomial time!
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-3 rounded-lg border border-purple-500/30 bg-purple-500/5 p-2 text-xs text-purple-200">
          <p className="font-semibold">💡 Construction Process:</p>
          <p className="mt-1 text-purple-300/80">
            {showVertices < literals.length 
              ? `Creating vertices from formula literals...`
              : showEdges < edges.length
              ? `Connecting compatible vertices from different clauses...`
              : highlightClique
              ? `3-Clique found! This proves the formula is satisfiable.`
              : `Graph complete with ${literals.length} vertices and ${edges.length} edges.`}
          </p>
        </div>
      </div>
    </div>
  )
}

export default CliqueGraphAnimation
