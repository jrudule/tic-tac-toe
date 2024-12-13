import { useState } from 'react'
import './App.css'

function App() {
  const [board, setBoard] = useState(Array(3).fill(Array(3).fill('')));
  const [emptyCellCount, setemptyCellCount] = useState(9);
  const [isEnded, setIsEnded] = useState(false);

  const checkWinner = (board, rowIndex, colIndex) => {
    const size = board.length;
    board[rowIndex][colIndex] = 'X';
  
    // To check rows
    for (let row of board) {
      if (row.every((cell) => cell && cell === row[0])) {
        return row[0];
      }
    }

    // To check columns
    for (let col = 0; col < size; col++) {
      let colValues = board.map((row) => row[col]);
      if (colValues.every((cell) => cell && cell === colValues[0])) {
        return colValues[0];
      }
    }

    // To check diagonal from top-left to bottom-right
    let mainDiagonal = board.map((row, index) => row[index]);
    if (mainDiagonal.every((cell) => cell && cell === mainDiagonal[0])) {
      return mainDiagonal[0];
    }

    // To check diagonal from top-right to bottom-left
    let antiDiagonal = board.map((row, index) => row[size - 1 - index]);
    if (antiDiagonal.every((cell) => cell && cell === antiDiagonal[0])) {
      return antiDiagonal[0];
    }

    return null;
  };

  function addSymbol(rowIndex, colIndex) {
    if(board[rowIndex][colIndex] === ''){
      var roundEnded = false;
      setBoard(prevBoard => {
        const newBoard = prevBoard.map(rowArr => [...rowArr]);
        newBoard[rowIndex][colIndex] = 'X';
        return newBoard;
      })
      setemptyCellCount(emptyCellCount-1);

      if(checkWinner(board, rowIndex, colIndex) && emptyCellCount < 9){
        console.log("You won");
        roundEnded = true;
      }

      if (emptyCellCount > 1) {
        while (!roundEnded){
          var row = Math.floor(Math.random() * 3);
          var col = Math.floor(Math.random() * 3);

          if(board[row][col] === '' && row !== rowIndex && col !== colIndex){
            setBoard(prevBoard => {
              const newBoard = prevBoard.map(rowArr => [...rowArr]);
              newBoard[row][col] = 'O';
              return newBoard;
            })
            setemptyCellCount(emptyCellCount-2);
            roundEnded = true;
          } else {
            row = Math.floor(Math.random() * 3);
            col = Math.floor(Math.random() * 3);
          }
        }
      }
    }
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
