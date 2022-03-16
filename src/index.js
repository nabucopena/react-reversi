import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {playTurn, winning, playersPoints, botMove} from './gameLogic.js';


function basicBoard() {
  const board = new Array(8*8).fill(null);
  board[3*8+3] = 'O';
  board[3*8+4] = 'X';
  board[4*8+3] = 'X';
  board[4*8+4] = 'O';
  return (board)
}

function setBoardPlayers(squares, x, o, n) {
  return squares.map((s) => s == 'X' ? x : s == 'O' ? o : n)
}


function Square(props) {

  return (
    <button
      className={props.className + " square " + (props.value == 'X' ? 'xPiece' : props.value == 'O' ? 'oPiece' : '')}
      onClick={props.onClick}
    >
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
            className={(i+j)%2 === 0 ? "wSquare" : "bSquare"}
          /> ) }
        </div>
      );
  
  return (board)
}


function Game(props) {
  const boardWidth = 8;
  const [turn, setTurn] = useState('X');
  const [squares, setSquares] = useState(basicBoard());

  let status = turn == 'ended' ? 'Ended' : turn;
  const winner = winning(squares);


  function handleClick(square) {
    const t = playTurn({squares: squares, turn: turn, boardWidth: boardWidth}, square)
    const {squares: newBoard, turn: newTurn } = t;

    setTurn( newTurn ) ;
    setSquares( newBoard );

  }

  function restartGame() {
    setTurn('X');
    setSquares(basicBoard());
  }

  function callBot(gameState) {
    const move = botMove(gameState);
    handleClick(move)
  }
  
  const board = setBoardPlayers(squares, 'X', 'O', null)



  return (
    <div id="game">
      <div id="gameInfo"> 
        {status === 'Ended' ? <p> Ended </p> :
          <div className="center">
            <p>
              Turn 
            </p>
            <img id="turnFlag" src={status === 'X' ? "russia_flag.png" : "ukraine_flag.png"}/>
          </div>
        } 
      </div>
      <div className="flex">
        <div className="flag">
          <img className="flag" id="ukraine_flag" src="ukraine_flag.png"/>
          <p> puntos </p>
        </div>
        <div id="board">
          <Board
            squares={board}
            onClick={(i) => {handleClick(i)}}
            boardWidth={boardWidth}
          />
        </div>
        <div className="flag">
          <img className="flag" id="russia_flag" src="russia_flag.png"/>
          <p> puntos </p>
          <p id="restart">
            <button onClick= {restartGame}>
              Restart
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}



// ================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

