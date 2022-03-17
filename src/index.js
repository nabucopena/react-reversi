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
  const [firstTurn, setFirstTurn] = useState(true);

  if (firstTurn) {
    setFirstTurn(false);
    if (turn != props.player) {
      setTimeout (
        () => {
          callBot({squares, turn, boardWidth})
        },
        500
      )
    }
  }
  

  let status = turn == 'ended' ? 'Ended' : turn;
  const winner = winning(squares);



  function handleClick(gameState, square) {
    if (turn != props.player) {return;}
    handleMove(gameState, square)
  }

  function handleMove(gameState, square) {
    const t = playTurn({squares: gameState.squares, turn: gameState.turn, boardWidth: gameState.boardWidth}, square)
    const {squares: newBoard, turn: newTurn } = t;

    setSquares( newBoard );
    if (newTurn == 'ended') {
      setTimeout(
        () => {
          props.setPageState('ended');
          props.setWinner(winning(gameState.squares))
        },
        2000
      )
    } else {
      setTurn( newTurn );
    }
    if (newTurn == (props.player == 'X' ? 'O' : 'X')) {
      setTimeout (
        () => {
          callBot({squares: newBoard, turn: newTurn, boardWidth: gameState.boardWidth})
        },
        500
      )
    }
  }

  function restartGame() {
    setTurn('X');
    setSquares(basicBoard());
  }

  function callBot(gameState) {
    const move = botMove(gameState);
    handleMove(gameState, move)
    
  }
  
  const board = setBoardPlayers(squares, 'X', 'O', null);
 
  const [russia_points, ukraine_points] = playersPoints(squares);



  return (
    <div className="game">
      <div className="gameInfo"> 
        {status === 'Ended' ? <p> Ended </p> :
          <div className="center">
            <p>
              Turn 
            </p>
            <img className="turnFlag" src={status === 'X' ? "russia_flag.png" : "ukraine_flag.png"}/>
          </div>
        } 
      </div>
      <div className="flag ukr-flag">
        <img className="flag ukraine_flag" src="ukraine_flag.png"/>
        <p className="points ukraine_flag">
          {ukraine_points} 
        </p>
      </div>
      <div className="board">
        <Board
          squares={board}
          onClick={(i) => {handleClick({squares, turn, boardWidth},i)}}
          boardWidth={boardWidth}
        />
      </div>
      <div className="flag rus-flag">
        <img className="flag russia_flag" src="russia_flag.png"/>
        <p className="points russia_flag">
          {russia_points}
        </p>
      </div>
    </div>
  )
}

function Start(props) {
  return(
  <div className="center">
    <div className="center">
      <p className="text-center select-player">
        Select player
      </p>
    </div>
    <img src="ukraine_flag.png" className="select-flag selectUkraineFlag" onClick={() => {props.onClick('ukraine')}} />
    <img src="russia_flag.png" className="select-flag selectRussiaFlag" onClick={() => {props.onClick('russia')}} />
  </div>
  )
}

function Ended(props) {
  return(
    <div className="center">
      <img className="center" src={props.winner+"_win.jpeg"}/>
    </div>
  )
}

function Page(props) {
  const [pageState, setPageState] = useState('start');   //change this when finish
  const [player, setPlayer] = useState();
  const [winner, setWinner] = useState(); //change this when finish
  
  return(
    pageState === 'start' ? <Start
        onClick={(player) => {setPageState('game'); setPlayer(player);}}
      /> :
      pageState === 'game' ?
        <Game
          player={player == 'russia' ? 'X' : 'O'}
          setPageState={setPageState} 
          setWinner={setWinner}
        /> :
        <Ended
          winner={winner == 'X' ? 'russia' : 'ukraine'}
        />
  )
}



// ================================

ReactDOM.render(
  <Page />,
  document.getElementById('root')
);

