import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function basicBoard() {
  const board = new Array(8*8).fill('•');
  board[27] = 'O';
  board[36] = 'O';
  board[28] = 'X';
  board[35] = 'X';
  return (board)
}


function Square(props) {

  return (
    <button
      className="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

function Board(props) {
  const range = new Array(props.boardWidth).fill(0);

  const board =
    range.map( (_, i) =>
      <div key={i} className="board-row">
        { range.map( (_,j) => <Square
          key={ j+i*props.boardWidth }
          value={props.squares[ j+i*props.boardWidth ]}
          onClick={() => props.onClick( j+i*props.boardWidth )}
        /> ) }
      </div>
      );
  
  return (board)
}

function Game(props) {
  const boardWidth = 8
  const [turn, setTurn] = useState('X');
  
  function handleClick(square) {
    if (squares[square] != '•') {return;}
    const newBoard = [...squares]
    newBoard[square] = turn
    setTurn( (turn=='X'? 'O' : 'X') );
    setSquares( newBoard );
  }

  const [squares, setSquares] = useState(basicBoard())


  return (
    <div>
      <Board
        squares={squares}
        onClick={(i) => {handleClick(i)}}
        boardWidth={boardWidth}
      />
    </div>
  )
}



// ================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

