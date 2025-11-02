import { useState, useCallback, useEffect } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  Position,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
} from 'reactflow'
import type { Node } from 'reactflow'
import ProblemNode, { type ProblemNodeData } from './ProblemNode'
import { problems } from '../data/problems'
import type { ProblemId } from '../data/problems'

// Reduction steps with detailed explanations
const reductionSteps = [
  {
    id: 'sat-to-3cnf',
    source: 'sat',
    target: 'threeCnf',
    label: '🔄 Normalize',
    description: 'Convert arbitrary clauses to exactly 3 literals using Tseitin transformation',
  },
  {
    id: '3cnf-to-clique',
    source: 'threeCnf',
    target: 'clique',
    label: '🕸️ Graph Transform',
    description: 'Map Boolean clauses to graph vertices, satisfiability to k-clique problem',
  },
] as const

const nodePositions: Record<ProblemId, { x: number; y: number }> = {
  sat: { x: 50, y: 200 },
  threeCnf: { x: 500, y: 80 },
  clique: { x: 950, y: 220 },
}

const nodeTypes = { problemNode: ProblemNode }

type AnimationStep = {
  stage: number
  title: string
  description: string
  example: {
    input: string
    output: string
    explanation: string
  }
  highlightedNode?: string
  highlightedEdge?: string
}

const animationSteps: AnimationStep[] = [
  {
    stage: 0,
    title: 'Start: SAT Problem',
    description: 'We begin with a general Boolean Satisfiability problem',
    example: {
      input: 'Formula: (A ∨ B) ∧ (¬C ∨ D ∨ E ∨ F)',
      output: 'Question: Can we assign TRUE/FALSE to make this TRUE?',
      explanation: 'This formula has clauses of varying lengths - not standardized yet.',
    },
    highlightedNode: 'sat',
  },
  {
    stage: 1,
    title: 'Reduction: SAT → 3-CNF',
    description: 'Transform to 3-CNF using Tseitin encoding',
    example: {
      input: '(A ∨ B) ∧ (¬C ∨ D ∨ E ∨ F)',
      output: '(A ∨ B ∨ ⊤) ∧ (¬C ∨ D ∨ x₁) ∧ (¬x₁ ∨ E ∨ F)',
      explanation: 'Split long clause using helper variable x₁. Now all clauses have exactly 3 literals!',
    },
    highlightedEdge: 'sat-to-3cnf',
  },
  {
    stage: 2,
    title: 'Result: 3-CNF Problem',
    description: 'Now we have a standardized 3-SAT formula',
    example: {
      input: '(A ∨ B ∨ ⊤) ∧ (¬C ∨ D ∨ x₁) ∧ (¬x₁ ∨ E ∨ F)',
      output: '3 clauses, each with exactly 3 literals',
      explanation: 'Perfect format for graph conversion - every clause same size.',
    },
    highlightedNode: 'threeCnf',
  },
  {
    stage: 3,
    title: 'Reduction: 3-CNF → CLIQUE',
    description: 'Convert Boolean formula into graph problem',
    example: {
      input: '3 clauses with 3 literals each',
      output: 'Graph with 9 vertices (3 per clause)',
      explanation: 'Connect vertices if: (1) from different clauses, (2) not contradictory',
    },
    highlightedEdge: '3cnf-to-clique',
  },
  {
    stage: 4,
    title: 'Result: CLIQUE Problem',
    description: 'Now we search for a k-clique in the graph',
    example: {
      input: 'Graph G with vertices for each literal',
      output: 'Find k-clique (k=3) → one vertex per clause',
      explanation: 'If k-clique exists → formula is satisfiable! Graph problem ≡ SAT problem.',
    },
    highlightedNode: 'clique',
  },
]

const FlowCanvas = () => {
  const [highlightedEdge, setHighlightedEdge] = useState<string | null>(null)
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null)
  const [, setSelectedNode] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentAnimationStep, setCurrentAnimationStep] = useState(0)
  const [showExamplePanel, setShowExamplePanel] = useState(false)

  const initialNodes: Node<ProblemNodeData>[] = (
    Object.entries(problems) as [ProblemId, typeof problems[ProblemId]][]
  ).map(([id, problem]) => ({
    id,
    type: 'problemNode',
    position: nodePositions[id],
    data: {
      title: problem.title,
      subtitle: problem.subtitle,
      summary: problem.summary,
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  }))

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    reductionSteps.map((step) => ({
      id: step.id,
      source: step.source,
      target: step.target,
      type: 'smoothstep',
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#94a3b8',
      },
      label: step.label,
      style: {
        stroke: '#94a3b8',
        strokeWidth: 2,
      },
      labelStyle: {
        fill: '#cbd5e1',
        fontWeight: 600,
        fontSize: 13,
      },
      labelBgStyle: {
        fill: '#0f172a',
        fillOpacity: 0.9,
      },
      labelBgPadding: [10, 6] as [number, number],
      labelBgBorderRadius: 6,
    })),
  )

  // Handle animation walkthrough
  useEffect(() => {
    if (!isAnimating) return

    const interval = setInterval(() => {
      setCurrentAnimationStep((prev) => {
        if (prev < animationSteps.length - 1) {
          return prev + 1
        } else {
          setIsAnimating(false)
          return prev
        }
      })
    }, 5000) // 5 seconds per step

    return () => clearInterval(interval)
  }, [isAnimating])

  // Update highlights based on current animation step
  useEffect(() => {
    if (isAnimating || showExamplePanel) {
      const step = animationSteps[currentAnimationStep]
      setHighlightedEdge(step.highlightedEdge || null)
      setHighlightedNode(step.highlightedNode || null)
    } else {
      setHighlightedEdge(null)
      setHighlightedNode(null)
    }
  }, [currentAnimationStep, isAnimating, showExamplePanel])

  // Update edges and nodes when highlights change
  useEffect(() => {
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: highlightedEdge === edge.id ? '#06b6d4' : '#94a3b8',
        },
        style: {
          stroke: highlightedEdge === edge.id ? '#06b6d4' : '#94a3b8',
          strokeWidth: highlightedEdge === edge.id ? 4 : 2,
          filter:
            highlightedEdge === edge.id ? 'drop-shadow(0 0 12px rgba(6, 182, 212, 0.8))' : 'none',
        },
        labelStyle: {
          fill: highlightedEdge === edge.id ? '#06b6d4' : '#cbd5e1',
          fontWeight: 600,
          fontSize: 13,
        },
      })),
    )

    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isActive: highlightedNode === node.id,
        },
        style: {
          ...node.style,
          opacity: highlightedNode === node.id ? 1 : highlightedNode ? 0.4 : 1,
          filter: highlightedNode === node.id ? 'drop-shadow(0 0 20px rgba(6, 182, 212, 0.8))' : 'none',
        },
      })),
    )
  }, [highlightedEdge, highlightedNode, setEdges, setNodes])

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      setSelectedNode(node.id)
    },
    [setSelectedNode],
  )

  const startAnimation = () => {
    setCurrentAnimationStep(0)
    setIsAnimating(true)
    setShowExamplePanel(true)
  }

  const stopAnimation = () => {
    setIsAnimating(false)
  }

  const nextStep = () => {
    if (currentAnimationStep < animationSteps.length - 1) {
      setCurrentAnimationStep((prev) => prev + 1)
      setShowExamplePanel(true)
    }
  }

  const prevStep = () => {
    if (currentAnimationStep > 0) {
      setCurrentAnimationStep((prev) => prev - 1)
      setShowExamplePanel(true)
    }
  }

  const resetAnimation = () => {
    setCurrentAnimationStep(0)
    setIsAnimating(false)
    setShowExamplePanel(false)
    setHighlightedEdge(null)
    setHighlightedNode(null)
  }

  const currentStep = animationSteps[currentAnimationStep]

  return (
    <div className="space-y-4">
      {/* Control Panel */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800/60 bg-slate-950/60 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={startAnimation}
            disabled={isAnimating}
            className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-5 py-2.5 text-sm font-semibold text-cyan-200 transition-all hover:border-cyan-500/60 hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isAnimating ? '▶ Playing...' : '▶ Start Animated Walkthrough'}
          </button>

          <button
            onClick={stopAnimation}
            disabled={!isAnimating}
            className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-200 transition-all hover:border-slate-600 hover:bg-slate-750 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ⏸ Pause
          </button>

          <button
            onClick={resetAnimation}
            className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-200 transition-all hover:border-slate-600 hover:bg-slate-750"
          >
            ↺ Reset
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={prevStep}
            disabled={currentAnimationStep === 0 || isAnimating}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-200 transition-all hover:border-slate-600 hover:bg-slate-750 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Prev
          </button>

          <span className="rounded-lg bg-slate-800 px-3 py-2 text-xs font-mono text-slate-300">
            {currentAnimationStep + 1} / {animationSteps.length}
          </span>

          <button
            onClick={nextStep}
            disabled={currentAnimationStep === animationSteps.length - 1 || isAnimating}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-200 transition-all hover:border-slate-600 hover:bg-slate-750 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Main Content: Flow Diagram + Live Example Side by Side */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* React Flow Canvas */}
        <div className="relative h-[500px] w-full overflow-hidden rounded-3xl border border-slate-800/60 bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 shadow-2xl shadow-cyan-500/10 md:h-[600px]">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            minZoom={0.3}
            maxZoom={1.5}
            defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
            className="bg-transparent"
            proOptions={{ hideAttribution: true }}
          >
            <Background
              color="#475569"
              gap={24}
              size={1.5}
              style={{ opacity: 0.4 }}
            />
            <Controls className="rounded-xl border border-slate-700 bg-slate-800/90 shadow-lg backdrop-blur-sm [&>button]:bg-slate-700 [&>button]:border-slate-600 [&>button]:text-slate-200 [&>button]:transition-all [&>button:hover]:bg-slate-600 [&>button:hover]:border-slate-500" />
          </ReactFlow>

          {/* Floating step indicator */}
          {showExamplePanel && currentStep && (
            <div className="absolute top-4 left-4 right-4 z-10 rounded-xl border border-cyan-500/40 bg-slate-900/95 px-4 py-3 shadow-lg backdrop-blur-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                    Step {currentAnimationStep + 1}: {currentStep.title}
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-100">{currentStep.description}</p>
                </div>
                <button
                  onClick={() => setShowExamplePanel(false)}
                  className="text-slate-400 transition-colors hover:text-slate-200"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Example Panel */}
        {showExamplePanel && currentStep ? (
          <div className="rounded-2xl border border-slate-800/60 bg-slate-950/80 p-5 backdrop-blur-sm h-[500px] md:h-[600px] overflow-auto">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-100">
                Live Example
              </h3>
              <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-300">
                Step {currentAnimationStep + 1}/{animationSteps.length}
              </span>
            </div>

            <div className="space-y-4">
              {/* Input */}
              <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">Input:</p>
                <p className="mt-2 font-mono text-sm text-blue-200">{currentStep.example.input}</p>
              </div>

              {/* Transformation arrow */}
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-3 text-cyan-400">
                  <div className="h-px flex-1 bg-linear-to-r from-transparent via-cyan-500 to-transparent"></div>
                  <span className="text-2xl">⬇</span>
                  <div className="h-px flex-1 bg-linear-to-r from-transparent via-cyan-500 to-transparent"></div>
                </div>
              </div>

              {/* Output */}
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Output:</p>
                <p className="mt-2 font-mono text-sm text-emerald-200">{currentStep.example.output}</p>
              </div>

              {/* Explanation */}
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
                <div className="flex items-start gap-3">
                  <span className="text-xl">💡</span>
                  <div className="flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                      What Happened:
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-amber-100">
                      {currentStep.example.explanation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center rounded-2xl border border-slate-800/60 bg-slate-950/40 p-8 backdrop-blur-sm h-[500px] md:h-[600px]">
            <div className="text-center">
              <div className="mb-4 text-6xl">🎬</div>
              <h3 className="text-xl font-semibold text-slate-200">Start the Animation</h3>
              <p className="mt-2 text-sm text-slate-400">
                Click "Start Animation" to see live examples<br />of each reduction step
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="rounded-2xl border border-slate-800/60 bg-slate-950/60 p-4">
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="h-3 w-8 rounded-full bg-linear-to-r from-cyan-500 to-blue-500"></div>
            <span>Active reduction path</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-8 rounded-full bg-slate-500"></div>
            <span>Standard path</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-cyan-400 animate-pulse"></div>
            <span>Watch the flow animate automatically</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const ReductionFlow = () => (
  <ReactFlowProvider>
    <FlowCanvas />
  </ReactFlowProvider>
)

export default ReductionFlow
