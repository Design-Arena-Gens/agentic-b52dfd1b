'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

const ROWS = 40
const COLS = 60
const CELL_SIZE = 12

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
]

const generateEmptyGrid = () => {
  const rows = []
  for (let i = 0; i < ROWS; i++) {
    rows.push(Array.from(Array(COLS), () => 0))
  }
  return rows
}

export default function GameOfLife() {
  const [grid, setGrid] = useState(() => generateEmptyGrid())
  const [running, setRunning] = useState(false)
  const [generation, setGeneration] = useState(0)
  const [speed, setSpeed] = useState(100)

  const runningRef = useRef(running)
  runningRef.current = running

  const speedRef = useRef(speed)
  speedRef.current = speed

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return
    }

    setGrid((g) => {
      const newGrid = g.map((row, i) =>
        row.map((cell, j) => {
          let neighbors = 0
          operations.forEach(([x, y]) => {
            const newI = i + x
            const newJ = j + y
            if (newI >= 0 && newI < ROWS && newJ >= 0 && newJ < COLS) {
              neighbors += g[newI][newJ]
            }
          })

          if (neighbors < 2 || neighbors > 3) {
            return 0
          } else if (cell === 0 && neighbors === 3) {
            return 1
          } else {
            return cell
          }
        })
      )
      return newGrid
    })

    setGeneration(gen => gen + 1)

    setTimeout(runSimulation, speedRef.current)
  }, [])

  const handleStart = () => {
    setRunning(true)
    runningRef.current = true
    runSimulation()
  }

  const handleStop = () => {
    setRunning(false)
    runningRef.current = false
  }

  const handleClear = () => {
    setGrid(generateEmptyGrid())
    setGeneration(0)
    setRunning(false)
  }

  const handleRandom = () => {
    const rows = []
    for (let i = 0; i < ROWS; i++) {
      rows.push(Array.from(Array(COLS), () => (Math.random() > 0.7 ? 1 : 0)))
    }
    setGrid(rows)
    setGeneration(0)
  }

  const handleCellClick = (i: number, j: number) => {
    const newGrid = grid.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        if (rowIndex === i && colIndex === j) {
          return cell ? 0 : 1
        }
        return cell
      })
    )
    setGrid(newGrid)
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1 style={{ marginBottom: '20px', fontSize: '32px' }}>Conway's Game of Life</h1>

      <div style={{ marginBottom: '20px' }}>
        <div style={{
          display: 'inline-grid',
          gridTemplateColumns: `repeat(${COLS}, ${CELL_SIZE}px)`,
          gap: '1px',
          background: '#333',
          padding: '1px',
          border: '2px solid #555'
        }}>
          {grid.map((rows, i) =>
            rows.map((col, j) => (
              <div
                key={`${i}-${j}`}
                onClick={() => handleCellClick(i, j)}
                style={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  backgroundColor: grid[i][j] ? '#00ff41' : '#1a1a1a',
                  cursor: 'pointer',
                  transition: 'background-color 0.1s'
                }}
              />
            ))
          )}
        </div>
      </div>

      <div style={{ marginBottom: '15px', fontSize: '18px' }}>
        Generation: <strong>{generation}</strong>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {!running ? (
          <button
            onClick={handleStart}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              cursor: 'pointer',
              background: '#00ff41',
              color: '#0a0a0a',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 'bold'
            }}
          >
            Start
          </button>
        ) : (
          <button
            onClick={handleStop}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              cursor: 'pointer',
              background: '#ff4444',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 'bold'
            }}
          >
            Stop
          </button>
        )}

        <button
          onClick={handleRandom}
          disabled={running}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            cursor: running ? 'not-allowed' : 'pointer',
            background: running ? '#444' : '#4444ff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            opacity: running ? 0.5 : 1
          }}
        >
          Random
        </button>

        <button
          onClick={handleClear}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            cursor: 'pointer',
            background: '#666',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold'
          }}
        >
          Clear
        </button>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="speed" style={{ marginRight: '10px' }}>
          Speed: {speed}ms
        </label>
        <input
          id="speed"
          type="range"
          min="10"
          max="500"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          style={{ width: '200px', verticalAlign: 'middle' }}
        />
      </div>

      <div style={{ marginTop: '30px', fontSize: '14px', color: '#888', maxWidth: '600px', margin: '30px auto 0' }}>
        <p><strong>Rules:</strong></p>
        <ul style={{ textAlign: 'left', lineHeight: '1.6' }}>
          <li>Any live cell with 2 or 3 live neighbors survives</li>
          <li>Any dead cell with exactly 3 live neighbors becomes alive</li>
          <li>All other cells die or stay dead</li>
        </ul>
        <p style={{ marginTop: '10px' }}>Click cells to toggle them on/off</p>
      </div>
    </div>
  )
}
