import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {playTurn, winning} from './gameLogic.js';


function basicBoard() {
  const board = new Array(8*8).fill('•');
  board[3*8+3] = 'O';
  board[3*8+4] = 'X';
  board[4*8+3] = 'X';
  board[4*8+4] = 'O';
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
  const boardWidth = 8;
  const [turn, setTurn] = useState('X');
  const [squares, setSquares] = useState(basicBoard());

  let status = turn == 'ended' ? 'Ended' : ('Turn: ' + turn);
  const winner = winning(squares);


  function handleClick(square) {
    const t = playTurn({squares: squares, turn: turn, boardWidth: boardWidth}, square)
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

