import { useState } from 'react'
import './App.css'

function App() {
  const [board, setBoard] = useState(Array(3).fill(Array(3).fill('')));
  const [isEnded, setIsEnded] = useState(false);
  const [isWinner, setIsWinner] = useState(null);

  function checkWinner(board) {
    const size = board.length;

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

  // To check if one of the players have 2 symbols 
  // and 1 free space in row, col or diagonal
  function checkRowForWinningMove(cells, symbol) {
    const symbolCount = cells.filter(cell => cell === symbol).length;
    const emptyCount = cells.filter(cell => cell === '').length;
    return symbolCount === 2 && emptyCount === 1;
  }

  function findWinningRowOrCol(board, symbol) {
    const size = board.length;
  
    // Check rows
    for (let rowIndex = 0; rowIndex < size; rowIndex++) {
      if (checkRowForWinningMove(board[rowIndex], symbol)) {
        const emptyColIndex = board[rowIndex].indexOf('');
        return { row: rowIndex, col: emptyColIndex };
      }
    }
  
    // Check columns
    for (let colIndex = 0; colIndex < size; colIndex++) {
      const column = board.map(row => row[colIndex]);
      if (checkRowForWinningMove(column, symbol)) {
        const emptyRowIndex = column.indexOf('');
        return { row: emptyRowIndex, col: colIndex };
      }
    }
  
    return null;
  }
  
  function findWinningDiagonal(board, symbol) {
    const size = board.length;
  
    // To check diagonal from top-left to bottom-right
    let mainDiagonal = [];
    for (let i = 0; i < size; i++) {
      mainDiagonal.push(board[i][i]);
    }
    if (checkRowForWinningMove(mainDiagonal, symbol)) {
      const emptyCellIndex = mainDiagonal.indexOf('');
      return { row: emptyCellIndex, col: emptyCellIndex };
    }
  
    // To check anti-diagonal from top-right to bottom-left
    let antiDiagonal = [];
    for (let i = 0; i < size; i++) {
      antiDiagonal.push(board[i][size - 1 - i]);
    }
    if (checkRowForWinningMove(antiDiagonal, symbol)) {
      const emptyCellIndex = antiDiagonal.indexOf('');
      return { row: emptyCellIndex, col: size - 1 - emptyCellIndex };
    }
  
    return null;
  }
  

  function addSymbol(rowIndex, colIndex) {
    if(board[rowIndex][colIndex] !== '') return;
    
    // User move
    const userBoard = board.map((row, rIndex) =>
      row.map((cell, cIndex) => (rIndex === rowIndex && cIndex === colIndex ? 'X' : cell))
    );
    setBoard(userBoard);
  
    if (checkWinner(userBoard)) {
      console.log('You won');
      setIsEnded(true);
      setIsWinner('user');
      return;
    }

    const emptyCells = [];
    userBoard.forEach((row, rIndex) => {
      row.forEach((cell, cIndex) => {
        if (!cell) emptyCells.push([rIndex, cIndex]);
      });
    });

    if (emptyCells.length === 0) {
      setIsWinner("It's a tie");
      setIsEnded(true);
      return;
    }

    // Computer's move
    let compRow, compCol, result;
    if (findWinningRowOrCol(userBoard, 'O')) {
      result =findWinningRowOrCol(userBoard, 'O');
    } 
    else if (findWinningDiagonal(userBoard, 'O')) {
      result = findWinningDiagonal(userBoard, 'O');
    } 
    else if (findWinningRowOrCol(userBoard, 'X')) {
      result = findWinningRowOrCol(userBoard, 'X');
    } 
    else {
      result = findWinningDiagonal(userBoard, 'X');
    }
    console.log(userBoard);
    if (result) {
      compRow = result.row;
      compCol = result.col;
    } else{
      [compRow, compCol] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }  
    const computerBoard = userBoard.map((row, rIndex) =>
      row.map((cell, cIndex) => (rIndex === compRow && cIndex === compCol ? 'O' : cell))
    );
    setBoard(computerBoard);

    if (checkWinner(computerBoard)) {
      console.log('You lost');
      setIsEnded(true);
      setIsWinner('computer');
    }
  }

  return (
    <>
      <div className={isEnded ? '' : 'hidden'}> {isWinner} </div>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="row" style={{ display: "flex", marginBottom: "10px" }}>
          {row.map((symbol, colIndex) => (
            <div key={colIndex} className="col"
              onClick={() => addSymbol(rowIndex, colIndex)}
            >
              {symbol}
            </div>
          ))}      
        </div>
      ))}
    </>
  )
}

export default App
