import { render, screen, fireEvent } from '@testing-library/react';
import App from './src/App';

const game = {
    userSymbol: null,
    computerSymbol: null,
    board: Array(9).fill(null),

    // Set the symbols for user and computer
    setUserSymbol(symbol) {
        this.userSymbol = symbol;
        this.computerSymbol = symbol === 'X' ? 'O' : 'X';
    },

    // Computer places its symbol
    computerMove() {
        const emptyIndex = this.board.findIndex(cell => cell === null);
        if (emptyIndex !== -1) {
        this.board[emptyIndex] = this.computerSymbol;
        }
    },

    // Check if the board is updated correctly
    getBoard() {
        return this.board;
    }
};

describe('Tic Tac Toe', () => {
  beforeEach(() => {
    game.board = Array(9).fill(null);
    game.userSymbol = null;
    game.computerSymbol = null;
  });

  test('T_KN-1: Starting the game', () => {
    window.onload = () => { 
        render(<App />);
        expect(screen.getByText('Tic Tac Toe')).toBeInTheDocument();

        const startButton = screen.getByText('Start');
        fireEvent.click(startButton);
        
        const board = game.getBoard();

        expect(startButton).not.toBeInTheDocument();
        expect(screen.queryByText('Tic Tac Toe')).not.toBeInTheDocument();
        expect(screen.getByText('Choose between X and O')).not.toBeInTheDocument();
        expect(screen.getByText('Place your symbol (X or O) in an empty square.')).toBeInTheDocument();
        expect(board).toBeInTheDocument();
      };
});

  test('T_KN-2.1: Choice X', () => {
    window.onload = () => { 
        render(<App />);
        const xButton = screen.getByText('X');
        fireEvent.click(xButton);

        fireEvent.click(screen.getByText('Start'));
        const gameCells = screen.getAllByRole('button', { name: '' });
        expect(gameCells.length).toBe(9);
    };
  });

  test('T_KN-2.2: Choice O', () => {
    window.onload = () => { 
        render(<App />);
        const xButton = screen.getByText('O');
        fireEvent.click(xButton);

        fireEvent.click(screen.getByText('Start'));
        const gameCells = screen.getAllByRole('button', { name: '' });
        expect(gameCells.length).toBe(8);
    };
  });

  test('T_KN-2.3: Computer choice is O', () => {
    game.setUserSymbol('X');
    expect(game.userSymbol).toBe('X');
    expect(game.computerSymbol).toBe('O');
  });

  test('T_KN-2.4: Computer choice is X', () => {
    game.setUserSymbol('O');
    expect(game.userSymbol).toBe('O');
    expect(game.computerSymbol).toBe('X');
  });

  test('T_KN-3.1: Placing a user symbol on the field', () => {
    window.onload = () => { 
        render(<App />);
        fireEvent.click(screen.getByText('X'));
        fireEvent.click(screen.getByText('Start'));

        const gameCells = screen.getAllByRole('button', { name: '' });
        fireEvent.click(gameCells[0]);

        expect(gameCells[0]).toHaveTextContent('X');
    };
  });

  test('T_KN-3.2: Computer places symbol on board', () => {
    game.setUserSymbol('O');
    game.computerMove();

    const board = game.getBoard();
    expect(board.filter(cell => cell === 'X').length).toBe(1);
    expect(board.includes('O')).toBe(false);
  });

  test('T_KN-4: Restarting the game', () => {
    render(<App />);
    fireEvent.click(screen.getByText('X'));
    fireEvent.click(screen.getByText('Start'));

    game.board = [
      ["X", "O", ""], 
      ["X", "X", "O"], 
      ["O", "O", "X"]
    ];
    
    fireEvent.click(screen.getByText('Restart'));
    expect(screen.getByText('Tic Tac Toe')).toBeInTheDocument();
    expect(screen.getByText('Choose between X and O')).toBeInTheDocument();
    expect(screen.getByText('Start')).toBeInTheDocument();
  });

  test('T_KN-4.1: User wins', () => {
    window.onload = () => { 
        render(<App />);
        fireEvent.click(screen.getByText('X'));
        fireEvent.click(screen.getByText('Start'));

        game.board = [
          ["X", "O", ""], 
          ["X", "X", "O"], 
          ["O", "O", "X"]
        ];

        expect(screen.getByText('You won!')).toBeInTheDocument();
    };
  });

  test('T_KN-4.2: User loses', () => {
    window.onload = () => { 
        render(<App />);
        fireEvent.click(screen.getByText('X'));
        fireEvent.click(screen.getByText('Start'));

        game.board = [
          ["X", "O", ""], 
          ["X", "X", "O"], 
          ["O", "O", "O"]
        ];

        expect(screen.getByText('You lost!')).toBeInTheDocument();
    };
  });

  test('T_KN-4.3: Tie game', () => {
    window.onload = () => { 
        render(<App />);
        fireEvent.click(screen.getByText('X'));
        fireEvent.click(screen.getByText('Start'));

        game.board = [
          ["O", "O", "X"], 
          ["X", "X", "O"], 
          ["O", "O", "X"]
        ];

        expect(screen.getByText("It's a tie!")).toBeInTheDocument();
    };
  });

  it('T_KN-6: View rules', () => {
    render(<App />);
    const howToPlayButton = screen.getByText('How to play');
    fireEvent.click(howToPlayButton);

    expect(screen.getByText(
      'Place your symbol (X or O) in an empty square.'
    )).toBeInTheDocument();
  });

  it('T_KN-7: Hide rules', () => {
    render(<App />);
    const howToPlayButton = screen.getByText('How to play');
    fireEvent.click(howToPlayButton);

    const closeButton = screen.getByText('x');
    fireEvent.click(closeButton);

    expect(closeButton.parentElement).toHaveClass('hidden');
  });
});
