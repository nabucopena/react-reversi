import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function basicBoard() {
  const board = new Array(8*8).fill('•');
  board[3*8+3] = 'O';
  board[3*8+4] = 'X';
  board[4*8+3] = 'X';
  board[4*8+4] = 'O';
  return (board)
}

function ended(squares) {
  return (!squares.some(x => x == '•'))
}

function winning(squares) {
  const xs = squares.filter(x => x == 'X').length; 
  const os = squares.filter(x => x == 'O').length;
  return (os>xs ? 'O' : xs>os ? 'X' : 'draw')
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
  const boardWidth = props.boardWidth

  const board =
    range.map( (_, i) =>
      <div key={i} className="board-row">
        { range.map( (_,j) => <Square
          key={ i*boardWidth+j }
          value={props.squares[ i*boardWidth+j ]}
          onClick={() => props.onClick( i*boardWidth+j )}
        /> ) }
      </div>
      );
  
  return (board)
}

function Game(props) {
  const boardWidth = 2
  const [turn, setTurn] = useState('X');

  function handleClick(square) {
    if (squares[square] != '•') {return;}

    const newBoard = [...squares]
    newBoard[square] = turn
    
    setTurn( (turn=='X'? 'O' : 'X') );
    setSquares( newBoard );
  }


//  const [squares, setSquares] = useState(basicBoard());
  const [squares, setSquares] = useState(new Array(4).fill('•'));

  const gameEnded = ended(squares);
  const status = gameEnded ? 'Ended' : undefined ;

  const winner = winning(squares);


  return (
<div>
    <div>
      <p> {status} </p>
      <p> Winning: {winner} </p>
    </div>
    <div>
      <Board
        squares={squares}
        onClick={(i) => {handleClick(i)}}
        boardWidth={boardWidth}
      />
    </div>
</div>
  )
}



// ================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

