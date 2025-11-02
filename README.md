# 🧮 NP-Completeness & Reductions Flow Visualizer

<div align="center">

![React](https://img.shields.io/badge/React-19.1.1-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178c6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.1.14-646cff?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.16-06b6d4?style=for-the-badge&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**An educational, interactive visualization tool that demonstrates how NP-Complete problems reduce into each other.**

[Live Demo](https://npcompletenessreduction.netlify.app/) • [Features](#-features) • [Installation](#-installation) • [Usage](#-usage)

</div>

---

## 📖 Overview

This project is an **interactive educational visualizer** designed to help students and professionals understand the concept of **polynomial-time reductions** between NP-Complete problems. Watch in real-time as problems transform from **SAT → 3-CNF → CLIQUE**, with detailed explanations, examples, and animated flows.

### 🎯 Educational Goals

- **Visualize Reduction Chains**: See how complex problems relate to each other
- **Understand Transformations**: Step-by-step breakdown of Tseitin transformation, clause padding, and gadget construction
- **Interactive Learning**: Try your own Boolean formulas and see them transformed to 3-CNF
- **Real Examples**: Live examples showing input/output at each reduction step

---

## ✨ Features

### 🎬 Animated Flow Diagram

- **Auto-playing walkthrough** with 5 comprehensive steps
- **Side-by-side layout**: Flow diagram and live examples displayed together
- **Node highlighting** with glowing effects and opacity transitions
- **Edge animations** showing active reduction paths
- **Active loaders** that appear below focused nodes during animation

### 🔄 Three Transformation Methods

1. **Tseitin Transformation**: Split long clauses using helper variables
2. **Clause Padding**: Add dummy variables to short clauses
3. **Gadget Construction**: Graph-based reduction visualization

### ✍️ Custom Formula Input

- Parse and transform your own Boolean formulas
- Real-time syntax validation
- Step-by-step transformation explanations
- Support for formulas like: `(A ∨ B) ∧ (¬C ∨ D ∨ E)`

### 📊 Interactive Components

- **Problem Node Cards**: Beautiful gradient cards with hover effects
- **Reduction Explainer**: Detailed tabs explaining SAT→3-CNF and 3-CNF→CLIQUE
- **Visual Transformation**: See structure changes at each reduction step
- **Info Panel**: Comprehensive problem descriptions and reduction insights

---

## 🛠️ Tech Stack

| Technology                 | Purpose                           |
| -------------------------- | --------------------------------- |
| **React 19.1.1**           | UI framework with latest features |
| **TypeScript 5.9.3**       | Type-safe development             |
| **Vite 7.1.14**            | Lightning-fast build tool         |
| **Tailwind CSS 4.1.16**    | Utility-first styling             |
| **Framer Motion 12.23.24** | Smooth animations and transitions |
| **React Flow 11.11.4**     | Interactive flow diagrams         |
| **Rolldown-Vite**          | Optimized bundling                |

---

## 🚀 Installation

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Steps

```bash
# Clone the repository
git clone https://github.com/hemangbhat/Np-Completeness-Reduction.git

# Navigate to project directory
cd Np-Completeness-Reduction

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will be available at `http://localhost:5173/`

---

## 📖 Usage

### Starting the Animation

1. Navigate to the **"Reduction Flow Diagram"** section
2. Click **"Start Animation"** to begin the 5-step walkthrough
3. Watch as the flow diagram highlights each step with:
   - Node highlighting with glow effects
   - Edge animations showing transformation paths
   - Active loaders below focused nodes
   - Live examples panel showing input/output

### Manual Navigation

- **Previous/Next**: Step through the animation manually
- **Pause**: Stop auto-play at any time
- **Reset**: Return to the beginning

### Trying Custom Formulas

1. Scroll to **"SAT to 3-CNF: Clause Normalization"**
2. Select a transformation method (Tseitin/Padding/Gadget)
3. Click **"Try Your Own Formula"**
4. Enter a Boolean formula or click an example
5. Click **"Transform to 3-CNF"** to see the results

**Example formulas to try:**

```
(A ∨ B) ∧ (¬C ∨ D ∨ E)
(A) ∧ (B ∨ C)
(A ∨ B ∨ C ∨ D) ∧ (¬E ∨ F)
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ReductionFlow.tsx       # Main animated flow diagram
│   ├── ProblemNode.tsx         # Custom React Flow nodes
│   ├── FormulaAnimation.tsx    # Interactive transformation widget
│   ├── ReductionExplainer.tsx  # Educational explanations
│   ├── VisualTransformation.tsx # Structure change visualization
│   └── InfoPanel.tsx           # Problem details panel
├── data/
│   └── problems.ts             # Problem metadata (SAT, 3-CNF, CLIQUE)
├── utils/
│   └── formulaParser.ts        # Formula parsing & transformation logic
├── App.tsx                     # Main application layout
└── main.tsx                    # Application entry point
```

---

## 🎨 Key Components

### ReductionFlow

The heart of the visualizer - an animated React Flow diagram showing SAT → 3-CNF → CLIQUE with:

- 5-step auto-playing animation
- Manual controls (Start/Pause/Reset/Prev/Next)
- Dynamic node and edge highlighting
- Side-by-side layout with live examples

### ProblemNode

Custom animated nodes with:

- Unique color gradients (Blue/Cyan/Purple)
- Icon badges and NP-Complete tags
- Hover effects with scale and glow
- Active loaders during animation

### FormulaAnimation

Interactive transformation widget featuring:

- Three transformation methods
- Auto-play mode with step-by-step progression
- Graph gadget visualization
- Custom formula input with validation

### formulaParser

Utility module providing:

- `parseFormula()`: Parse Boolean formulas to CNF
- `transformTo3CNF()`: Transform using Tseitin/Padding/Split methods
- `validateFormula()`: Syntax validation
- `formulaToString()`: Convert CNF back to display format

---

## 🌟 Educational Value

This visualizer is perfect for:

- **Computer Science Students**: Learning computational complexity theory
- **Algorithm Design Courses**: Understanding reduction techniques
- **Research**: Demonstrating NP-Completeness concepts
- **Self-Study**: Interactive exploration of theoretical concepts

### Learning Outcomes

✅ Understand what polynomial-time reductions are  
✅ See how NP-Complete problems relate to each other  
✅ Learn Tseitin transformation technique  
✅ Grasp the connection between SAT and graph problems  
✅ Practice with real Boolean formulas

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest new features
- Improve documentation
- Add more reduction examples

```bash
# Fork the repository
# Create a feature branch
git checkout -b feature/amazing-feature

# Commit your changes
git commit -m "Add amazing feature"

# Push to the branch
git push origin feature/amazing-feature

# Open a Pull Request
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👏 Acknowledgments

- Inspired by computational complexity theory courses
- Built with modern React and TypeScript best practices
- Designed for educational clarity and visual appeal

---

## 📧 Contact

**Hemang Bhat** - [@hemangbhat](https://github.com/hemangbhat)

Project Link: [https://github.com/hemangbhat/Np-Completeness-Reduction](https://github.com/hemangbhat/Np-Completeness-Reduction)

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ for the computer science community

</div>
```
