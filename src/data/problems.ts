// Centralized copy and metadata for the NP-complete problems rendered in the visualizer.
// Extend this record with additional problems (e.g., Vertex Cover, Subset Sum) and update
// the reduction steps array in `ReductionFlow` to grow the educational map.

export type ProblemId = 'sat' | 'threeCnf' | 'clique'

export interface ProblemInfo {
  id: ProblemId
  title: string
  subtitle: string
  summary: string
  reductionHint: string
}

export const problems: Record<ProblemId, ProblemInfo> = {
  sat: {
    id: 'sat',
    title: 'SAT',
    subtitle: 'Boolean Satisfiability',
    summary:
      'The archetype NP-complete problem. Given a Boolean formula, determine whether there is an assignment that satisfies it.',
    reductionHint:
      'Cook–Levin shows every NP problem reduces to SAT. We often normalize SAT further before targeting graph problems.',
  },
  threeCnf: {
    id: 'threeCnf',
    title: '3-CNF',
    subtitle: '3-SAT Canonical Form',
    summary:
      'Constrain formulas so every clause has exactly three literals. This keeps reductions structured and gadget-friendly.',
    reductionHint:
      'Transform SAT to 3-SAT via clause padding or Tseitin gadgets while preserving satisfiability.',
  },
  clique: {
    id: 'clique',
    title: 'CLIQUE',
    subtitle: 'Graph Density Threshold',
    summary:
      'Given a graph and integer k, does it contain a complete subgraph of size k? A cornerstone NP-complete graph problem.',
    reductionHint:
      'Map each clause/literal combo into graph gadgets so satisfying assignments become k-cliques.',
  },
}
