<template>
  <div class="min-h-screen bg-zinc-950 text-slate-100">
    <div class="mx-auto w-full max-w-5xl px-6 py-16 sm:px-12 lg:py-24">
      <header>
        <motion.a
          href="/"
          class="inline-flex w-fit items-center gap-2 text-sm font-medium text-slate-400 transition-colors duration-200 hover:text-white focus-visible:text-white focus-visible:outline-none"
          :whileHover="{ x: -4 }"
          :transition="{ type: 'spring', stiffness: 400, damping: 17 }"
        >
          <span aria-hidden="true">←</span>
          Back home
        </motion.a>
        <h1 class="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          A* Pathfinding Visualizer
        </h1>
        <p class="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-slate-300">
          Paint obstacles, set start and goal tiles, then watch the A* algorithm explore the grid.
          Toggle delay for instant solving or a step-by-step walkthrough. Works on touch devices too.
        </p>
      </header>

      <section class="mt-12">
        <div class="flex items-baseline justify-between">
          <h2 class="text-base font-semibold text-white">Controls</h2>
          <span class="text-xs tabular-nums text-slate-500">
            {{ gridMeta.cols }} × {{ gridMeta.rows }} grid
          </span>
        </div>

        <div class="mt-5 space-y-4 border-l border-white/10 pl-5 text-sm">
          <div class="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <p class="w-28 shrink-0 text-slate-400">Paint as</p>
            <div class="flex flex-wrap items-center gap-x-4 gap-y-1">
              <button
                v-for="mode in drawModes"
                :key="mode.value"
                type="button"
                :aria-pressed="controls.drawMode === mode.value"
                class="group inline-flex cursor-pointer items-center gap-2 transition-colors duration-200 focus-visible:outline-none"
                :class="controls.drawMode === mode.value
                  ? 'text-white'
                  : 'text-slate-400 hover:text-white focus-visible:text-white'"
                @click="setDrawMode(mode.value)"
              >
                <span
                  class="inline-block h-3 w-3 rounded-sm border border-white/10"
                  :style="{ background: mode.swatch }"
                  aria-hidden="true"
                ></span>
                <span
                  class="underline-offset-4"
                  :class="controls.drawMode === mode.value
                    ? 'underline'
                    : 'group-hover:underline group-focus-visible:underline'"
                >
                  {{ mode.label }}
                </span>
              </button>
            </div>
          </div>

          <div class="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <p class="w-28 shrink-0 text-slate-400">Pointer action</p>
            <div class="flex flex-wrap gap-x-4 gap-y-1">
              <button
                v-for="action in actionModes"
                :key="action.value"
                type="button"
                :aria-pressed="controls.actionMode === action.value"
                class="cursor-pointer underline-offset-4 transition-colors duration-200 focus-visible:outline-none"
                :class="controls.actionMode === action.value
                  ? 'text-white underline'
                  : 'text-slate-400 hover:text-white hover:underline focus-visible:text-white focus-visible:underline'"
                @click="setActionMode(action.value)"
              >
                {{ action.label }}
              </button>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
            <label for="step-delay" class="w-28 shrink-0 text-slate-400">Step delay</label>
            <input
              id="step-delay"
              type="range"
              :min="5"
              :max="250"
              v-model.number="controls.stepDelay"
              :disabled="!controls.delayEnabled"
              class="h-1 max-w-[10rem] flex-1 accent-white disabled:cursor-not-allowed disabled:opacity-40"
            />
            <span class="tabular-nums text-xs text-slate-400">
              {{ controls.delayEnabled ? `${controls.stepDelay} ms` : 'instant' }}
            </span>
            <USwitch
              v-model="controls.delayEnabled"
              size="sm"
              :aria-label="controls.delayEnabled ? 'Disable step delay' : 'Enable step delay'"
            />
          </div>

          <div class="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <p class="w-28 shrink-0 text-slate-400">Grid</p>
            <div class="flex flex-wrap gap-x-4 gap-y-1">
              <button
                type="button"
                class="cursor-pointer text-slate-200 underline-offset-4 transition-colors duration-200 hover:text-white hover:underline focus-visible:text-white focus-visible:underline focus-visible:outline-none"
                @click="randomizeObstacles()"
              >
                Randomize
              </button>
              <button
                type="button"
                class="cursor-pointer text-slate-200 underline-offset-4 transition-colors duration-200 hover:text-white hover:underline focus-visible:text-white focus-visible:underline focus-visible:outline-none"
                @click="clearObstacles"
              >
                Clear grid
              </button>
              <button
                type="button"
                class="cursor-pointer text-slate-200 underline-offset-4 transition-colors duration-200 hover:text-white hover:underline focus-visible:text-white focus-visible:underline focus-visible:outline-none"
                @click="resetStartGoal"
              >
                Reset endpoints
              </button>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1">
            <motion.button
              type="button"
              :disabled="isRunning"
              class="group inline-flex items-center gap-2 text-base font-semibold text-white transition-colors duration-200 cursor-pointer hover:text-slate-200 disabled:cursor-wait disabled:opacity-60 focus-visible:text-slate-200 focus-visible:outline-none"
              :whileHover="!isRunning ? { x: 4 } : {}"
              :transition="{ type: 'spring', stiffness: 400, damping: 17 }"
              @click="runSimulation"
            >
              {{ isRunning ? 'Solving…' : 'Run A* search' }}
              <span aria-hidden="true" class="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </motion.button>
            <button
              v-if="isRunning"
              type="button"
              class="cursor-pointer text-sm font-medium text-slate-400 underline-offset-4 transition-colors duration-200 hover:text-white hover:underline focus-visible:text-white focus-visible:underline focus-visible:outline-none"
              @click="stopSimulation"
            >
              Stop
            </button>
          </div>
        </div>
      </section>

      <section class="mt-16">
        <div class="flex items-baseline justify-between">
          <h2 class="text-base font-semibold text-white">Grid</h2>
          <span
            class="text-xs transition-colors duration-200"
            :class="isRunning ? 'text-amber-300' : 'text-slate-500'"
            aria-live="polite"
          >
            {{ isRunning ? 'Running' : 'Idle' }}
          </span>
        </div>
        <p class="mt-1 text-sm text-slate-400">
          Click or drag to paint. Green = start, red = goal.
        </p>
        <div ref="canvasRef" class="mt-5 overflow-hidden border border-white/10 bg-black/40" />
        <dl class="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
          <div v-for="stat in liveStats" :key="stat.label" class="flex items-baseline gap-2">
            <dt class="text-xs text-slate-500">{{ stat.label }}</dt>
            <dd class="text-base font-semibold tabular-nums text-white">{{ stat.value }}</dd>
          </div>
        </dl>
        <div class="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-400">
          <div v-for="item in legend" :key="item.label" class="flex items-center gap-2">
            <span class="h-2.5 w-2.5 rounded-sm" :style="{ background: item.color }" aria-hidden="true"></span>
            {{ item.label }}
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { motion } from 'motion-v'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - using custom shim in types/p5.d.ts
import type p5 from 'p5'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - using custom shim in types/p5.d.ts
type P5Module = typeof import('p5')

interface Cell {
  x: number
  y: number
  obstacle: boolean
  g: number
  h: number
  f: number
  parent: Cell | null
  neighbors: Cell[]
}

type DrawMode = 'obstacle' | 'start' | 'goal'
type ActionMode = 'draw' | 'erase'

useHead({
  title: 'A* Pathfinding Visualizer — Derin Alan Ritter'
})

const canvasRef = ref<HTMLDivElement | null>(null)
const isRunning = ref(false)

const controls = reactive({
  drawMode: 'obstacle' as DrawMode,
  actionMode: 'draw' as ActionMode,
  delayEnabled: true,
  stepDelay: 5
})

const gridMeta = reactive({ rows: 0, cols: 0 })
const status = reactive({ pathLength: 0, explored: 0, openCount: 0, closedCount: 0 })

const drawModes = [
  { label: 'Obstacle', value: 'obstacle' as DrawMode, swatch: '#5a5a5a' },
  { label: 'Start', value: 'start' as DrawMode, swatch: '#00c850' },
  { label: 'Goal', value: 'goal' as DrawMode, swatch: '#dc2d2d' }
]

const actionModes = [
  { label: 'Draw', value: 'draw' as ActionMode },
  { label: 'Erase', value: 'erase' as ActionMode }
]

const liveStats = computed(() => [
  { label: 'Path length', value: status.pathLength },
  { label: 'Explored', value: status.explored },
  { label: 'Open set', value: status.openCount },
  { label: 'Closed set', value: status.closedCount }
])

const legend = [
  { label: 'Start', color: '#00c850' },
  { label: 'Goal', color: '#dc2d2d' },
  { label: 'Open set', color: '#ffff00' },
  { label: 'Closed set', color: '#ff9696' },
  { label: 'Final path', color: '#32a05a' },
  { label: 'Obstacle', color: '#5a5a5a' }
]

let p5ctx: p5 | null = null
let P5Ctor: P5Module | null = null
let canvasWidth = 0
let canvasHeight = 0
let rows = 40
let cols = 20
let cellSize = 20
let grid: Cell[][] = []
let startCell: Cell | null = null
let goalCell: Cell | null = null
let isDrawing = false
let openList: Cell[] = []
let closedList: Cell[] = []
let finalPath: Cell[] = []
let isSimulationRunning = false

const calculateGridSize = () => {
  const parent = canvasRef.value
  if (typeof window === 'undefined') return
  const parentWidth = parent?.getBoundingClientRect().width ?? window.innerWidth
  const gridHeight = Math.min(800, Math.max(520, window.innerHeight * 0.65))
  rows = 40
  const heightBasedCell = Math.max(10, Math.floor(gridHeight / rows))
  cols = Math.max(10, Math.ceil(parentWidth / heightBasedCell))
  cellSize = parentWidth / cols
  canvasWidth = parentWidth
  canvasHeight = rows * cellSize
  gridMeta.rows = rows
  gridMeta.cols = cols
}

const addNeighbors = (cell: Cell) => {
  const { x, y } = cell
  const left = grid[y]?.[x - 1]
  const right = grid[y]?.[x + 1]
  const up = grid[y - 1]?.[x]
  const down = grid[y + 1]?.[x]
  if (left) cell.neighbors.push(left)
  if (right) cell.neighbors.push(right)
  if (up) cell.neighbors.push(up)
  if (down) cell.neighbors.push(down)
}

const resetAlgorithmState = () => {
  isSimulationRunning = false
  openList = []
  closedList = []
  finalPath = []

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const cell = grid[y]?.[x]
      if (!cell) continue
      cell.g = Infinity
      cell.h = 0
      cell.f = Infinity
      cell.parent = null
    }
  }

  status.pathLength = 0
  status.explored = 0
  status.openCount = 0
  status.closedCount = 0
}

const initializeGrid = () => {
  grid = []
  for (let y = 0; y < rows; y++) {
    const row: Cell[] = []
    for (let x = 0; x < cols; x++) {
      row.push({ x, y, obstacle: false, g: Infinity, h: 0, f: Infinity, parent: null, neighbors: [] })
    }
    grid.push(row)
  }

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const c = grid[y]?.[x]
      if (!c) continue
      c.neighbors = []
      addNeighbors(c)
    }
  }

  startCell = grid[Math.floor(rows * 0.1)]?.[Math.floor(cols * 0.1)] ?? grid[0]?.[0] ?? null
  goalCell = grid[Math.floor(rows * 0.9)]?.[Math.floor(cols * 0.9)] ?? grid[rows - 1]?.[cols - 1] ?? null
  if (startCell) startCell.obstacle = false
  if (goalCell) goalCell.obstacle = false
  resetAlgorithmState()
}

const clearObstacles = () => {
  stopSimulation()
  grid.forEach((row) => {
    row.forEach((cell) => {
      cell.obstacle = false
    })
  })
  if (startCell) startCell.obstacle = false
  if (goalCell) goalCell.obstacle = false
  resetAlgorithmState()
}

const randomizeObstacles = (density = 0.2) => {
  stopSimulation()
  grid.forEach((row) => {
    row.forEach((cell) => {
      if (cell !== startCell && cell !== goalCell) {
        cell.obstacle = Math.random() < density
      }
    })
  })
  if (startCell) startCell.obstacle = false
  if (goalCell) goalCell.obstacle = false
  resetAlgorithmState()
}

const resetStartGoal = () => {
  startCell = grid[Math.floor(rows * 0.1)]?.[Math.floor(cols * 0.1)] ?? grid[0]?.[0] ?? null
  goalCell = grid[Math.floor(rows * 0.9)]?.[Math.floor(cols * 0.9)] ?? grid[rows - 1]?.[cols - 1] ?? null
  if (startCell) startCell.obstacle = false
  if (goalCell) goalCell.obstacle = false
  resetAlgorithmState()
}

const sleep = (ms: number) => (controls.delayEnabled ? new Promise((resolve) => setTimeout(resolve, ms)) : Promise.resolve())

const manhattanDistance = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.abs(a.x - b.x) + Math.abs(a.y - b.y)

const reconstructPath = (endCell: Cell) => {
  finalPath = []
  let current: Cell | null = endCell
  while (current) {
    finalPath.push(current)
    current = current.parent
  }
  finalPath.reverse()
  status.pathLength = finalPath.length
}

const startSimulation = async () => {
  if (isSimulationRunning || !startCell || !goalCell) return false
  resetAlgorithmState()
  isSimulationRunning = true
  isRunning.value = true

  startCell.g = 0
  startCell.h = manhattanDistance(startCell, goalCell)
  startCell.f = startCell.g + startCell.h
  openList = [startCell]

  let iterations = 0
  while (openList.length > 0 && isSimulationRunning) {
    iterations++
    let currentCell = openList[0]
    let currentIndex = 0
    for (let i = 1; i < openList.length; i++) {
      const candidate = openList[i]
      if (candidate && currentCell && candidate.f < currentCell.f) {
        currentCell = candidate
        currentIndex = i
      }
    }

    if (!currentCell) break

    openList.splice(currentIndex, 1)
    closedList.push(currentCell)
    status.closedCount = closedList.length
    status.openCount = openList.length
    status.explored = closedList.length

    await sleep(controls.stepDelay)

    if (currentCell === goalCell) {
      reconstructPath(currentCell)
      isSimulationRunning = false
      isRunning.value = false
      return true
    }

    currentCell.neighbors.forEach((neighbor) => {
      if (neighbor.obstacle || closedList.includes(neighbor)) return

      const tentativeG = currentCell.g + 1
      if (!openList.includes(neighbor)) {
        openList.push(neighbor)
      } else if (tentativeG >= neighbor.g) {
        return
      }

      neighbor.parent = currentCell
      neighbor.g = tentativeG
      neighbor.h = manhattanDistance(neighbor, goalCell as Cell)
      neighbor.f = neighbor.g + neighbor.h
    })

    if (iterations > 6000) {
      isSimulationRunning = false
      isRunning.value = false
      return false
    }
  }

  isSimulationRunning = false
  isRunning.value = false
  return false
}

const stopSimulation = () => {
  isSimulationRunning = false
  isRunning.value = false
}

const handleInteraction = () => {
  if (!p5ctx) return
  const x = Math.floor(p5ctx.mouseX / cellSize)
  const y = Math.floor(p5ctx.mouseY / cellSize)
  if (x < 0 || x >= cols || y < 0 || y >= rows) return
  const cell = grid[y]?.[x]
  if (!cell) return

  if (controls.actionMode === 'draw') {
    if (controls.drawMode === 'obstacle') {
      if (cell !== startCell && cell !== goalCell) cell.obstacle = true
    } else if (controls.drawMode === 'start') {
      if (startCell) startCell.obstacle = false
      startCell = cell
      cell.obstacle = false
    } else if (controls.drawMode === 'goal') {
      if (goalCell) goalCell.obstacle = false
      goalCell = cell
      cell.obstacle = false
    }
  } else {
    if (cell !== startCell && cell !== goalCell) {
      cell.obstacle = false
    }
  }

  resetAlgorithmState()
}

const sketch = (p: p5) => {
  p5ctx = p

  const isPointerInsideCanvas = () => p.mouseX >= 0 && p.mouseX < canvasWidth && p.mouseY >= 0 && p.mouseY < canvasHeight

  p.setup = () => {
    calculateGridSize()
    const canvas = p.createCanvas(canvasWidth, canvasHeight)
    const parent = canvasRef.value
    if (parent) canvas.parent(parent)
    const canvasElt = (canvas as unknown as { elt?: HTMLCanvasElement }).elt
    if (canvasElt) canvasElt.style.touchAction = 'manipulation'
    initializeGrid()
  }

  p.windowResized = () => {
    calculateGridSize()
    p.resizeCanvas(canvasWidth, canvasHeight)
    initializeGrid()
  }

  p.mousePressed = (_event?: MouseEvent) => {
    isDrawing = true
    handleInteraction()
  }

  p.mouseDragged = (_event?: MouseEvent) => {
    if (isDrawing) handleInteraction()
  }

  p.mouseReleased = () => {
    isDrawing = false
  }

  p.touchStarted = (_event?: TouchEvent) => {
    if (!isPointerInsideCanvas()) return
    isDrawing = true
    handleInteraction()
  }

  p.touchMoved = (_event?: TouchEvent) => {
    if (!isDrawing) return
    if (!isPointerInsideCanvas()) {
      isDrawing = false
      return
    }
    handleInteraction()
  }

  p.touchEnded = (_event?: TouchEvent) => {
    isDrawing = false
  }

  p.draw = () => {
    p.background(30)
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cell = grid[y]?.[x]
        if (!cell) continue
        p.stroke(0)
        p.strokeWeight(1)

        if (cell === startCell) {
          p.fill(0, 200, 80)
        } else if (cell === goalCell) {
          p.fill(220, 45, 45)
        } else if (finalPath.includes(cell)) {
          p.fill(50, 160, 90)
        } else if (closedList.includes(cell)) {
          p.fill(255, 150, 150)
        } else if (openList.includes(cell)) {
          p.fill(255, 255, 0)
        } else if (cell.obstacle) {
          p.fill(90)
        } else {
          p.fill(240)
        }

        p.rect(x * cellSize, y * cellSize, cellSize, cellSize)

        if (cellSize > 16 && cell.g !== Infinity && cell !== startCell && cell !== goalCell && !cell.obstacle) {
          p.fill(0)
          p.textAlign(p.CENTER, p.CENTER)
          p.textSize(Math.max(8, cellSize * 0.24))
          p.text(Math.round(cell.f), x * cellSize + cellSize / 2, y * cellSize + cellSize / 2)
        }
      }
    }
  }
}

const setDrawMode = (mode: DrawMode) => {
  controls.drawMode = mode
}

const setActionMode = (mode: ActionMode) => {
  controls.actionMode = mode
}

const runSimulation = async () => {
  await startSimulation()
}

onMounted(() => {
  if (typeof window === 'undefined') return
  ;(async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - using custom shim in types/p5.d.ts
    const module = await import('p5')
    P5Ctor = (module as unknown as { default: P5Module }).default ?? (module as unknown as P5Module)
    // eslint-disable-next-line no-new
    new (P5Ctor as unknown as typeof p5)(sketch)
  })()
})

onBeforeUnmount(() => {
  stopSimulation()
  if (p5ctx) {
    p5ctx.remove()
    p5ctx = null
  }
})
</script>
