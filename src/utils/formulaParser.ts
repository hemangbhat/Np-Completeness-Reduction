// Formula parser and transformer utilities

export type Literal = {
  variable: string
  negated: boolean
}

export type Clause = Literal[]

export type CNFFormula = Clause[]

// Parse a formula string into CNF structure
export function parseFormula(input: string): CNFFormula {
  // Remove whitespace
  const formula = input.replace(/\s+/g, '')
  
  // Split by ∧ (AND) to get clauses
  const clauseStrings = formula.split('∧')
  
  const cnf: CNFFormula = []
  
  for (const clauseStr of clauseStrings) {
    // Remove parentheses
    const cleaned = clauseStr.replace(/[()]/g, '')
    
    // Split by ∨ (OR) to get literals
    const literalStrings = cleaned.split('∨')
    
    const clause: Clause = []
    for (const litStr of literalStrings) {
      if (litStr.trim()) {
        const negated = litStr.startsWith('¬')
        const variable = negated ? litStr.substring(1) : litStr
        clause.push({ variable, negated })
      }
    }
    
    if (clause.length > 0) {
      cnf.push(clause)
    }
  }
  
  return cnf
}

// Convert CNF back to string
export function formulaToString(cnf: CNFFormula): string {
  return cnf
    .map(
      (clause) =>
        '(' +
        clause.map((lit) => (lit.negated ? '¬' : '') + lit.variable).join(' ∨ ') +
        ')',
    )
    .join(' ∧ ')
}

// Transform to 3-CNF using different methods
export function transformTo3CNF(
  cnf: CNFFormula,
  method: 'tseitin' | 'padding' | 'split',
): { formula: CNFFormula; steps: string[] } {
  const steps: string[] = []
  let result: CNFFormula = []
  let helperVarCount = 1

  if (method === 'tseitin' || method === 'split') {
    // Split long clauses using helper variables
    steps.push('Identifying clauses that need splitting...')
    
    for (const clause of cnf) {
      if (clause.length <= 3) {
        result.push(clause)
        if (clause.length < 3) {
          steps.push(
            `Clause ${formulaToString([clause])} has ${clause.length} literals - will pad later`,
          )
        }
      } else {
        steps.push(
          `Clause ${formulaToString([clause])} has ${clause.length} literals - splitting...`,
        )
        
        // Split clause into groups of 3
        let remaining = [...clause]
        
        while (remaining.length > 3) {
          const helperVar = `x${helperVarCount++}`
          
          // Take first 2 literals and add helper variable
          const newClause: Clause = [
            remaining[0],
            remaining[1],
            { variable: helperVar, negated: false },
          ]
          result.push(newClause)
          
          steps.push(`Created: ${formulaToString([newClause])} with helper ${helperVar}`)
          
          // Create continuation clause with negated helper
          remaining = [{ variable: helperVar, negated: true }, ...remaining.slice(2)]
        }
        
        // Add final clause
        if (remaining.length > 0) {
          result.push(remaining)
          steps.push(`Final part: ${formulaToString([remaining])}`)
        }
      }
    }
    
    // Pad short clauses
    steps.push('Padding short clauses to exactly 3 literals...')
    result = result.map((clause) => {
      if (clause.length === 1) {
        const padVar = `y${helperVarCount++}`
        const padded = [
          ...clause,
          { variable: padVar, negated: false },
          { variable: padVar, negated: true },
        ]
        steps.push(
          `Padded ${formulaToString([clause])} to ${formulaToString([padded])} using ${padVar}`,
        )
        return padded
      } else if (clause.length === 2) {
        const padVar = `z${helperVarCount++}`
        const padded = [...clause, { variable: padVar, negated: false }]
        steps.push(
          `Padded ${formulaToString([clause])} to ${formulaToString([padded])} using ${padVar}`,
        )
        return padded
      }
      return clause
    })
  } else if (method === 'padding') {
    // Only pad short clauses, handle long ones by padding with True
    steps.push('Using clause padding method...')
    
    for (const clause of cnf) {
      if (clause.length === 3) {
        result.push(clause)
      } else if (clause.length < 3) {
        steps.push(`Padding short clause ${formulaToString([clause])}...`)
        let padded = [...clause]
        
        while (padded.length < 3) {
          const padVar = `p${helperVarCount++}`
          padded.push({ variable: padVar, negated: false })
          steps.push(`Added padding variable ${padVar}`)
        }
        
        result.push(padded)
      } else {
        // For long clauses with padding method, just take first 3 and note the rest
        steps.push(
          `Clause ${formulaToString([clause])} is too long - using first 3 literals (simplified)`,
        )
        result.push(clause.slice(0, 3))
      }
    }
  }

  steps.push('Transformation complete! All clauses now have exactly 3 literals.')
  
  return { formula: result, steps }
}

// Validate formula syntax
export function validateFormula(input: string): { valid: boolean; error?: string } {
  if (!input.trim()) {
    return { valid: false, error: 'Formula cannot be empty' }
  }

  // Check for balanced parentheses
  let depth = 0
  for (const char of input) {
    if (char === '(') depth++
    if (char === ')') depth--
    if (depth < 0) return { valid: false, error: 'Unbalanced parentheses' }
  }
  if (depth !== 0) return { valid: false, error: 'Unbalanced parentheses' }

  // Check for valid characters
  const validChars = /^[A-Za-z0-9∨∧¬()\s]+$/
  if (!validChars.test(input)) {
    return { valid: false, error: 'Invalid characters. Use: letters, ∨, ∧, ¬, parentheses' }
  }

  // Check for proper operators
  if (input.includes('∧∧') || input.includes('∨∨')) {
    return { valid: false, error: 'Consecutive operators not allowed' }
  }

  return { valid: true }
}
