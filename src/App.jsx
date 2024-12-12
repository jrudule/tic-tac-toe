import { useState } from 'react'
import './App.css'

function App() {
  const [board, setBoard] = useState(Array(3).fill(Array(3).fill('')));

  function addSymbol(row, col) {
    setBoard(prevBoard => {
      const newBoard = prevBoard.map(rowArr => [...rowArr]);
      newBoard[row][col] = 'X';
      return newBoard;
    })
  }

  return (
    <>

      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="row" style={{ display: "flex", marginBottom: "10px" }}>
          {row.map((number, colIndex) => (
            <div key={colIndex} className="col"
              onClick={() => addSymbol(rowIndex, colIndex)}
            >
              {number}
            </div>
          ))}      
        </div>
      ))}
    </>
  )
}

export default App
