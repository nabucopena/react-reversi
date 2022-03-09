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
  const winner = (os>xs ? 'O' : xs>os ? 'X' : 'draw')
  return (winner)
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

function gameLogic(props) {
  function handleClick ({squares, square, turn}) {
    const newBoard = [...squares];
    newBoard[square] = turn;
    const newTurn = turn == 'X' ? 'O' : 'X' ;
    return (
      {
        squares: newBoard,
        turn: newTurn,
      }
    )
  }

  const result = props.squares[props.square] != '•' ? props : handleClick(props);
  return (result)
}

function Game(props) {
  const boardWidth = 2
  const [turn, setTurn] = useState('X');


//  const [squares, setSquares] = useState(basicBoard());
  const [squares, setSquares] = useState(new Array(4).fill('•'));

  let status = ended(squares) ? 'Ended' : 'In progress';
  const winner = winning(squares);


  function handleClick(square) {
    const t = gameLogic({squares: squares, square: square, turn: turn})
    const {squares: newBoard, turn: newTurn } = t;

    setTurn( newTurn ) ;
    setSquares( newBoard );

  }



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

