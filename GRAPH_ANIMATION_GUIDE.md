# CLIQUE Graph Animation Feature Guide

## Overview

The NP-Completeness Reduction Visualizer now includes an **animated CLIQUE graph construction** feature that visualizes how a 3-CNF formula is transformed into a CLIQUE problem.

## Features

### 1. **Animated Graph Construction**

- **Step-by-step vertex rendering**: Vertices appear one by one (300ms intervals)
- **Edge animation**: Edges are drawn in batches of 3 (200ms intervals)
- **Clique highlighting**: Once constructed, valid 3-cliques are highlighted with golden pulsing rings
- **Synchronized with main walkthrough**: Graph animation progresses alongside the reduction flow

### 2. **Custom Formula Input**

- Enter your own 3-CNF formulas to see how they're transformed into CLIQUE graphs
- Real-time graph regeneration based on custom input
- Format: `(A ∨ B ∨ C) ∧ (¬A ∨ ¬B ∨ D) ∧ (¬C ∨ D ∨ E)`
- Supports:
  - `∨` for OR
  - `∧` for AND
  - `¬` for NOT

### 3. **Toggle Between Views**

- **Example View**: Traditional input/output/explanation format
- **Graph Animation View**: Interactive animated CLIQUE construction with custom formula input

## How to Use

### Step 1: Start the Animation

1. Click the "Start Animation" button in the main ReductionFlow component
2. The walkthrough will begin, showing each reduction step

### Step 2: View Graph Animation

1. Once the animation starts, the "Live Example" panel appears on the right
2. Click the "Graph Animation" tab to switch from Example view to Graph view
3. The graph will automatically animate based on the current walkthrough step

### Step 3: Try Custom Formulas

1. In the Graph Animation view, find the "Custom 3-CNF Formula" input field
2. Enter a valid 3-CNF formula (each clause should have 3 literals)
3. The graph will automatically regenerate based on your formula
4. Watch as vertices and edges are constructed step-by-step

### Step 4: Control Animation Speed

Use the playback speed dropdown to adjust animation speed:

- **0.25×** - Very slow (educational)
- **0.5×** - Slow
- **0.75×** - Slightly slow
- **1×** - Normal (default)
- **1.25×** - Slightly fast
- **1.5×** - Fast
- **1.75×** - Very fast
- **2×** - Double speed

## Animation Stages

The graph construction follows these stages based on the walkthrough step:

| Step | Stage       | Description                                 |
| ---- | ----------- | ------------------------------------------- |
| 0-1  | Preparation | Graph resets, preparing for construction    |
| 2    | Vertices    | Vertices appear one by one from each clause |
| 3    | Edges       | Edges are drawn between compatible vertices |
| 4+   | Clique      | Valid 3-clique is highlighted in gold       |

## Graph Construction Logic

### Vertex Creation

- Each literal in the 3-CNF formula becomes a vertex
- Vertices are positioned in a grid layout (3 clauses × 3 literals each)
- Color-coded by clause for easy identification

### Edge Creation

- Edges connect vertices from **different clauses**
- Only non-contradictory vertices are connected (e.g., A and ¬A won't connect)
- Represents the "compatibility" requirement for CLIQUE

### Clique Detection

- Algorithm searches for a valid 3-clique:
  - One vertex from each clause
  - All three vertices must be pairwise connected
- Highlighted with golden pulsing animations when found

## Example Formulas to Try

```
Basic Example:
(A ∨ B ∨ C) ∧ (¬A ∨ ¬B ∨ D) ∧ (¬C ∨ D ∨ E)

Simple Formula:
(X ∨ Y ∨ Z) ∧ (¬X ∨ Y ∨ Z) ∧ (X ∨ ¬Y ∨ Z)

Complex Formula:
(P ∨ Q ∨ R) ∧ (¬P ∨ ¬Q ∨ S) ∧ (¬R ∨ S ∨ T)
```

## Technical Details

### Component: `CliqueGraphAnimation.tsx`

- **Props**:
  - `formula: string` - The 3-CNF formula to visualize
  - `isAnimating: boolean` - Controls whether animation is running
  - `animationStep: number` - Current step in the main walkthrough (0-4)

### Animation Timings

- **Vertex appearance**: 300ms between each vertex
- **Edge appearance**: 200ms between batches of 3 edges
- **Clique highlight**: Immediate once edges are complete

### Graph Layout

- **3×3 grid positioning** for standard 3-clause formulas
- **200px horizontal spacing** between clause columns
- **80px vertical spacing** between vertices
- **Centered viewport** with responsive sizing

## Tips

1. **Watch the full animation first** before trying custom formulas to understand the construction process
2. **Use slow speeds (0.25× or 0.5×)** for educational purposes
3. **Experiment with different formulas** to see how contradictions affect edge creation
4. **Look for the golden clique** - it represents a valid satisfying assignment!
5. **Toggle between Example and Graph views** to compare the textual explanation with visual construction

## Keyboard Shortcuts

- **←/→ Arrow keys** (when focused): Previous/Next step
- **Space bar**: Play/Pause animation
- **Tab**: Navigate between controls

## Troubleshooting

### Graph not animating?

- Ensure you've clicked "Start Animation"
- Check that you're on the "Graph Animation" tab
- Verify the animation step is 2 or higher

### Custom formula not working?

- Ensure proper formatting: `(A ∨ B ∨ C) ∧ (D ∨ E ∨ F) ∧ (G ∨ H ∨ I)`
- Each clause must have exactly 3 literals
- Use correct symbols: ∨ (OR), ∧ (AND), ¬ (NOT)

### Graph looks incomplete?

- Wait for the animation to complete
- Increase animation speed if it's too slow
- Check that all edges have been drawn (step 3 complete)

## Future Enhancements

Potential improvements for future versions:

- Support for variable number of clauses (not just 3)
- Interactive vertex selection to manually find cliques
- Step-by-step explanation overlay during construction
- Export graph as image
- Comparison view showing multiple formulas side-by-side
