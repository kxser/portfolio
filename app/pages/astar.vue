<template>
  <div class="min-h-screen bg-zinc-950 text-slate-100">
    <UContainer class="py-12 space-y-8">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-2">
          <h1 class="text-3xl font-semibold text-white sm:text-4xl">A* Pathfinding Visualizer</h1>
          <p class="max-w-2xl text-sm text-slate-400 sm:text-base">
            Paint obstacles, set start/goal tiles, then watch the A* algorithm explore the grid. Toggle delay for instant
            solving or slower, step-by-step visualization. Fully touch friendly.
          </p>
        </div>
        <div class="flex flex-wrap gap-3">
          <UButton
            to="/"
            variant="ghost"
            color="neutral"
            icon="i-heroicons-arrow-left"
            label="Back home"
            class="border border-white/20 hover:border-white/50 cursor-pointer"
          />
        </div>
      </div>

      <div class="grid gap-6 lg:grid-cols-[320px,1fr]">
        <UCard class="border border-white/10 bg-white/5">
          <template #header>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-semibold uppercase text-slate-200">Controls</p>
                <p class="text-sm text-slate-300">Configure drawing + simulation</p>
              </div>
              <UBadge color="neutral" variant="subtle">{{ gridMeta.cols }} x {{ gridMeta.rows }}</UBadge>
            </div>
          </template>

          <div class="space-y-5">
            <div class="space-y-2">
              <p class="text-xs font-semibold uppercase text-slate-400">Draw Mode</p>
              <div class="grid grid-cols-3 gap-2">
                <UButton
                  v-for="mode in drawModes"
                  :key="mode.value"
                  color="neutral"
                  :variant="controls.drawMode === mode.value ? 'solid' : 'outline'"
                  size="sm"
                  :class="[
                    'cursor-pointer border transition',
                    controls.drawMode === mode.value ? 'border-white' : 'border-white/20 hover:border-white/50'
                  ]"
                  :aria-pressed="controls.drawMode === mode.value"
                  @click="setDrawMode(mode.value)"
                >
                  {{ mode.label }}
                </UButton>
              </div>
            </div>

            <div class="space-y-3">
              <p class="text-xs font-semibold uppercase text-slate-400">Action</p>
              <div class="grid grid-cols-2 gap-2">
                <UButton
                  color="neutral"
                  :variant="controls.actionMode === 'draw' ? 'solid' : 'outline'"
                  size="sm"
                  :aria-pressed="controls.actionMode === 'draw'"
                  class="cursor-pointer border transition border-white/20 hover:border-white/50"
                  @click="setActionMode('draw')"
                >
                  Draw
                </UButton>
                <UButton
                  color="neutral"
                  :variant="controls.actionMode === 'erase' ? 'solid' : 'outline'"
                  size="sm"
                  :aria-pressed="controls.actionMode === 'erase'"
                  class="cursor-pointer border transition border-white/20 hover:border-white/50"
                  @click="setActionMode('erase')"
                >
                  Erase
                </UButton>
              </div>
            </div>

            <div class="space-y-3">
              <div class="flex items-center justify-between text-sm text-slate-300">
                <span>Step delay</span>
                <div class="flex items-center gap-2">
                  <span class="text-xs text-slate-400">{{ controls.stepDelay }} ms</span>
                  <USwitch v-model="controls.delayEnabled" size="sm" />
                </div>
              </div>
              <input type="range" :min="5" :max="250" v-model.number="controls.stepDelay" class="w-full accent-white" />
              <p class="text-xs text-slate-400">Disable delay for instant solving; keep on for step-by-step.</p>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <UButton
                color="neutral"
                variant="outline"
                icon="i-heroicons-sparkles"
                class="cursor-pointer border border-white/20 hover:border-white/50"
                @click="randomizeObstacles()"
              >
                Randomize
              </UButton>
              <UButton
                color="neutral"
                variant="outline"
                icon="i-heroicons-backspace"
                class="cursor-pointer border border-white/20 hover:border-white/50"
                @click="clearObstacles"
              >
                Clear
              </UButton>
              <UButton
                color="neutral"
                variant="outline"
                icon="i-heroicons-arrow-path"
                class="cursor-pointer border border-white/20 hover:border-white/50"
                @click="resetStartGoal"
              >
                Reset start/goal
              </UButton>
              <UButton
                color="neutral"
                variant="outline"
                icon="i-heroicons-stop"
                class="cursor-pointer border border-white/20 hover:border-white/50"
                @click="stopSimulation"
              >
                Stop
              </UButton>
            </div>

            <UButton
              block
              color="neutral"
              variant="solid"
              size="lg"
              :loading="isRunning"
              icon="i-heroicons-play"
              class="cursor-pointer border border-white/20 hover:border-white/50"
              @click="runSimulation"
            >
              Start A*
            </UButton>
          </div>
        </UCard>

        <div class="space-y-6">
          <div class="grid gap-4 sm:grid-cols-4">
            <UCard class="border border-white/10 bg-white/5">
              <p class="text-xs font-semibold uppercase text-slate-200">Path length</p>
              <p class="text-2xl font-semibold text-white">{{ status.pathLength }}</p>
            </UCard>
            <UCard class="border border-white/10 bg-white/5">
              <p class="text-xs font-semibold uppercase text-slate-200">Explored</p>
              <p class="text-2xl font-semibold text-white">{{ status.explored }}</p>
            </UCard>
            <UCard class="border border-white/10 bg-white/5">
              <p class="text-xs font-semibold uppercase text-slate-200">Open set</p>
              <p class="text-2xl font-semibold text-white">{{ status.openCount }}</p>
            </UCard>
            <UCard class="border border-white/10 bg-white/5">
              <p class="text-xs font-semibold uppercase text-slate-200">Closed set</p>
              <p class="text-2xl font-semibold text-white">{{ status.closedCount }}</p>
            </UCard>
          </div>

          <UCard class="border border-white/10 bg-white/5">
            <template #header>
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-xs font-semibold uppercase text-slate-200">Canvas</p>
                  <p class="text-sm text-slate-300">Tap or click to paint. Red = goal, Green = start.</p>
                </div>
                <UBadge :color="isRunning ? 'warning' : 'neutral'" variant="subtle">
                  {{ isRunning ? 'Running' : 'Idle' }}
                </UBadge>
              </div>
            </template>
            <div ref="canvasRef" class="overflow-hidden rounded-xl border border-white/10 bg-black/50" />
          </UCard>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - using custom shim in types/p5.d.ts
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
  { label: 'Obstacle', value: 'obstacle' as DrawMode },
  { label: 'Start', value: 'start' as DrawMode },
  { label: 'Goal', value: 'goal' as DrawMode }
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
  // eslint-disable-next-line no-new
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
