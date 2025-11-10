# 🎬 Graph Animation Controls Guide

## Overview

The CLIQUE Graph Animation now includes comprehensive independent controls that allow you to:

- 🎚️ **Adjust animation speed** with a smooth slider (0.25x - 3x)
- 📚 **Start with example formulas** that align with the walkthrough
- ✏️ **Switch to custom formulas** whenever you want
- ▶️ **Control playback** independently from the main walkthrough

## 🚀 How to Use

### Step 1: Access the Graph Animation

1. Click **"Start Animation"** on the main page
2. Switch to the **"Graph Animation"** tab in the Live Example panel
3. You'll see the new animation controls interface

### Step 2: Control Animation Speed

The **Animation Speed Slider** lets you control how fast the graph builds:

- **0.25x - 0.75x**: Slow speeds for educational purposes, perfect for understanding each step
- **1x**: Normal speed (default)
- **1.25x - 3x**: Fast speeds for quick demonstrations

**How to adjust:**

- Drag the slider left for slower animation
- Drag right for faster animation
- Current speed is displayed in real-time (e.g., "1.5x")

### Step 3: Animate the Graph

Three control buttons are available:

#### ▶️ Animate Graph

- Starts the step-by-step graph construction
- Shows vertices appearing one by one
- Then draws edges between compatible vertices
- Finally highlights the valid 3-clique
- Button shows "⏳ Animating..." while running

#### 🔄 Reset

- Clears the entire graph
- Returns to the initial empty state
- Ready to animate again

#### ⏩ Show All

- Instantly displays the complete graph
- Shows all vertices, edges, and the highlighted clique
- Useful for quick reference

### Step 4: Formula Selection

You have two options:

#### 📚 Example Formula (Default)

- **Automatically aligns with your current walkthrough step**
- Changes as you progress through the animation steps
- Perfect for following along with the educational flow
- Click this button to use the synchronized example

**Example formulas from walkthrough:**

- Step 1: `(A ∨ B) ∧ (¬C ∨ D ∨ E ∨ F)` (original SAT)
- Step 2: `(A ∨ B ∨ ⊤) ∧ (¬C ∨ D ∨ x₁) ∧ (¬x₁ ∨ E ∨ F)` (3-CNF result)
- Steps 3-4: Same 3-CNF formula used for CLIQUE construction

#### ✏️ Custom Formula

- Click to switch to custom input mode
- Enter your own 3-CNF formula
- Click **"🔄 Apply & Reset Graph"** to update
- Graph resets and is ready to animate with your formula

**Format requirements:**

```
(A ∨ B ∨ C) ∧ (¬A ∨ ¬B ∨ D) ∧ (¬C ∨ D ∨ E)
```

- Use `∨` for OR
- Use `∧` for AND
- Use `¬` for NOT
- Each clause should have exactly 3 literals

**Example custom formulas to try:**

```
Simple:
(X ∨ Y ∨ Z) ∧ (¬X ∨ Y ∨ Z) ∧ (X ∨ ¬Y ∨ Z)

Complex:
(P ∨ Q ∨ R) ∧ (¬P ∨ ¬Q ∨ S) ∧ (¬R ∨ S ∨ T)

With variables:
(a ∨ b ∨ c) ∧ (¬a ∨ d ∨ e) ∧ (¬c ∨ ¬e ∨ f)
```

### Step 5: Watch the Animation

The graph builds in stages:

1. **Vertices Phase**

   - Vertices appear one at a time
   - Each vertex represents a literal from the formula
   - Colored by clause (blue, cyan, purple)
   - Progress shown: "X/9 vertices"

2. **Edges Phase**

   - Edges are drawn in batches of 3
   - Only compatible vertices get connected:
     - Must be from different clauses
     - Cannot be contradictory (e.g., A and ¬A)
   - Progress shown: "X/Y edges"

3. **Clique Highlight Phase**
   - Valid 3-clique is highlighted in gold
   - Shows one vertex from each clause
   - All three vertices are pairwise connected
   - Pulsing animation draws attention

## 🎯 Usage Scenarios

### Scenario 1: Following the Walkthrough

1. Start with **Example Formula** mode (default)
2. Progress through the main walkthrough steps
3. The formula automatically updates to match each step
4. Animate the graph at each stage to see the construction

### Scenario 2: Experimenting with Custom Formulas

1. Switch to **Custom Formula** mode
2. Enter your own 3-CNF formula
3. Click "Apply & Reset Graph"
4. Use different speeds to observe the construction
5. Try multiple formulas to understand edge creation rules

### Scenario 3: Quick Demonstrations

1. Use **Example Formula** for standard demonstration
2. Set speed to **2x or 3x** for quick overview
3. Or use **Show All** button to instantly reveal the complete graph
4. Reset and slow down to **0.5x** for detailed explanation

### Scenario 4: Educational Deep Dive

1. Set speed to **0.25x** (slowest)
2. Use **Example Formula** aligned with walkthrough
3. Watch carefully as each vertex appears
4. Observe which edges get created and why
5. See the clique formation step-by-step

## 📊 UI Components

### Speed Slider

```
[====●============================]
0.25x (Slow)      1x           3x (Fast)
```

- Real-time speed indicator
- Smooth continuous adjustment
- Visual markers at key speeds

### Control Buttons

```
[▶ Animate Graph] [🔄 Reset] [⏩ Show All]
```

- Clear icons for each action
- Disabled state when animating
- Hover effects for better UX

### Formula Selection

```
[📚 Example Formula] [✏️ Custom Formula]
```

- Toggle between modes
- Active button highlighted in purple
- Automatic reset on switch

### Current Formula Display

```
╔════════════════════════════════════╗
║ Current Formula:                   ║
║ (A ∨ B ∨ ⊤) ∧ (¬C ∨ D ∨ x₁) ∧ ... ║
╚════════════════════════════════════╝
```

- Always visible
- Shows active formula
- Monospace font for clarity

### Graph Status

```
9/9 vertices • 18/18 edges
```

- Real-time progress
- Updates during animation
- Helps track construction phase

## 🎨 Visual Feedback

### Vertex Colors

- **Blue (#3b82f6)**: Clause 1 literals
- **Cyan (#06b6d4)**: Clause 2 literals
- **Purple (#a855f7)**: Clause 3 literals

### Edge Styles

- **Gray**: Standard edges between compatible vertices
- **Golden**: Edges in the highlighted clique (pulsing)

### Animations

- **Vertices**: Scale and fade in (0.3s)
- **Edges**: Stroke dash animation (0.4s)
- **Clique**: Pulsing rings with scale animation (infinite)

## 💡 Tips & Best Practices

1. **Start with Example**: Always begin with the example formula to understand the basic structure
2. **Use Slow Speeds for Learning**: Set to 0.5x or 0.25x when teaching or learning
3. **Experiment with Custom**: Try different formulas to see how edge creation changes
4. **Reset Between Formulas**: Always reset when switching formulas for clean animation
5. **Watch the Edges**: Pay attention to which edges DON'T get created (contradictions)

## 🔧 Technical Details

### Animation Timings (at 1x speed)

- Vertex appearance: 300ms per vertex
- Edge batch: 200ms per 3 edges
- Clique highlight: 500ms delay after edges

### Speed Calculation

All timings are divided by the speed factor:

- At 0.5x: timings are doubled (slower)
- At 2x: timings are halved (faster)
- Formula: `timing_ms / speed_factor`

### Formula Parsing

- Splits by `∧` to identify clauses
- Splits by `∨` to identify literals
- Detects `¬` for negation
- Positions vertices in a 3×3 grid

## 🐛 Troubleshooting

**Problem: Animation not starting**

- Solution: Click "▶ Animate Graph" button
- Check that you're on the "Graph Animation" tab
- Try clicking "Reset" first

**Problem: Graph looks incomplete**

- Solution: Wait for animation to complete
- Check the progress indicator (X/9 vertices)
- Or click "Show All" to see complete graph

**Problem: Custom formula not working**

- Solution: Check format - must use ∨, ∧, ¬ symbols
- Ensure exactly 3 literals per clause
- Click "Apply & Reset Graph" after entering

**Problem: Speed too fast/slow**

- Solution: Adjust the slider
- Try preset values: 0.5x, 1x, 2x
- Fine-tune with 0.25x increments

## 🎓 Educational Value

This animation helps students understand:

1. **3-CNF Structure**: How formulas are organized into clauses
2. **Graph Construction**: How SAT reduces to CLIQUE
3. **Edge Rules**: Why only non-contradictory vertices connect
4. **Clique Finding**: How a k-clique represents a valid assignment
5. **Reduction Equivalence**: SAT solvable ⟺ k-CLIQUE exists

## 🚀 Next Steps

After mastering the graph animation:

1. Try the other tabs (Tseitin, Padding, Gadget transformations)
2. Experiment with more complex formulas
3. Create your own examples to test understanding
4. Share interesting formulas with classmates
5. Combine with the main walkthrough for full comprehension

---

**Enjoy exploring the CLIQUE reduction! 🎉**
