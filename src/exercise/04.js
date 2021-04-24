// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'
function Board({onClick, squares}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      {/* 🐨 put the status in the div below */}
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  // 🐨 squares is the state for this component. Add useState for squares
  // const [currentSquares, setSquares] = useLocalStorageState(
  //   'squares',
  //   Array(9).fill(null),
  // )
  const [history, setHistory] = useLocalStorageState('history', [
    Array(9).fill(null),
  ])
  const [currentTurn, setCurrentTurn] = useLocalStorageState('currentTurn', 0)
  const currentSquares = history[currentTurn]

  const nextValue = calculateNextValue(currentSquares)
  const winner = calculateWinner(currentSquares)
  const status = calculateStatus(winner, currentSquares, nextValue)
  const moves = calculateMoves(history, currentTurn, setCurrentTurn)

  function selectSquare(square) {
    if (winner || currentSquares[square]) return

    const squaresCopy = [...currentSquares]
    squaresCopy[square] = nextValue

    const newHistory = history.slice(0, currentTurn + 1)

    setHistory([...newHistory, squaresCopy])
    setCurrentTurn(newHistory.length)
  }

  function restart() {
    // 🐨 reset the squares
    // 💰 `Array(9).fill(null)` will do it!
    // setSquares(Array(9).fill(null))
    setHistory([Array(9).fill(null)])
    setCurrentTurn(0)
  }
  return (
    <div className="game">
      {/* <div className="game-board">
        <Board />
      </div> */}
      <div className="game-board">
        <Board onClick={selectSquare} squares={currentSquares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

function calculateMoves(history, currentTurn, setCurrentTurn) {
  return history.map((element, index) => {
    const isCurrentStep = index === currentTurn
    return (
      <li key={index}>
        <button disabled={isCurrentStep} onClick={() => setCurrentTurn(index)}>
          {index === 0 ? `Go to game start` : `Go to move #${index}`}
          {isCurrentStep && ` (current)`}
        </button>
      </li>
    )
  })
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  const xSquaresCount = squares.filter(r => r === 'X').length
  const oSquaresCount = squares.filter(r => r === 'O').length
  return oSquaresCount === xSquaresCount ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
