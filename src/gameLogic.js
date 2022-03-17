export function winning(squares) {
  const xs = squares.filter(x => x == 'X').length;
  const os = squares.filter(x => x == 'O').length;
  const winner = (os>xs ? 'O' : xs>os ? 'X' : 'draw')
  return (winner)
}

export function playersPoints(squares) {
  const xs = squares.filter(x => x == 'X').length;
  const os = squares.filter(x => x == 'O').length;
  return([xs, os])
}

export function playTurn(gameState, square) {
  const result = gameState.squares[square] || gameState.turn == 'ended' ? gameState : move(gameState, square);
  return (result)
}

function opponentTurn(turn) {
  return turn == 'X' ? 'O' : 'X'
}



export function botMove(gameState) {

  const points = gameState.squares.map(
    (x, i) => (
      !x &&
      evalBoard(gameState.squares, gameState.boardWidth, gameState.turn) <
        evalBoard(move(gameState, i).squares, gameState.boardWidth, gameState.turn) &&
      {ind: i, val: botMove1({squares: move(gameState, i).squares, boardWidth: gameState.boardWidth, turn: opponentTurn(gameState.turn)})}
    )
  ).filter((item) => !!item);

  const bestMovesArray = points.reduce(
    (bestIndices, currentValue, currentIndex) => (
      currentValue.val > points[bestIndices[0].val] ?
        [currentValue.ind] :
        currentValue == points[bestIndices[0].val] ?
          [...bestIndices, currentValue.ind]:
          bestIndices
    ),
    [{val: 0, ind: undefined}]
  );

  const r = bestMovesArray[Math.floor(Math.random()*bestMovesArray.length)]
  return r;
}


function botMove1(gameState) {
  const points = gameState.squares.map(
    (x, i) => (
      !x && evalBoard(move(gameState, i).squares, gameState.boardWidth, gameState.turn)
    )
  );
  const bestMovesArray = points.reduce(
    (bestIndices, currentValue, currentIndex) => (
      currentValue > points[bestIndices[0]] ?
        [currentIndex] :
        currentValue == points[bestIndices[0]] ?
          [...bestIndices, currentIndex]:
          bestIndices
    ),
    [0]
  );
  const r = bestMovesArray[Math.floor(Math.random()*bestMovesArray.length)]
  return r;
}







function getCorners (board) {
  return [0, board.width - 1, board.length - 1, board.length - board.width]
}

function evalBoard(board, boardWidth, player) {
  const corners = {quantity: getCorners({width: boardWidth, length: board.length}).filter((x) => board[x] == player).length, value: 3};
  const pieces = {quantity: board.filter(x => x == player).length, value: 1}; 
  const elements_values = [corners, pieces];
  
  const result = elements_values.map(({quantity, value}) => quantity*value).reduce((a, b) => a+b, 0);
  return result;
}




function somePossibleMove(gameState) {
  const result = gameState.squares.some(
    (x, i) => (
      !x && calculateSquares(
        gameState, i
      ).length > 0
    )
  );
  return result;
}


function move(gameState, square) { 
  const changedSquares = calculateSquares(gameState, square)
  if (changedSquares.length < 1) {
    return gameState;
  }  

  const {squares, turn, boardWidth} = gameState;
  const newBoard = [...squares];
  newBoard[square] = turn;
  changedSquares.forEach((x) => {newBoard[x] = turn});
  const noTurn = turn == 'X' ? 'O' : 'X';
  const newTurn = somePossibleMove({squares: newBoard, turn: noTurn, boardWidth: boardWidth}) ? noTurn : somePossibleMove({squares: newBoard, turn: turn, boardWidth: boardWidth}) ? turn : 'ended';


  return (
    {
      squares: newBoard,
      turn: newTurn,
    }
  )
}

function calculateSquaresDir(gameState, square, dir) {

  const {squares, turn, boardWidth} = gameState;
  let potencialSqrs = [];
  const column = square%boardWidth;
  const row = Math.floor(square/boardWidth);

  for (let i = 1; i < boardWidth; i++) {
    const {c, r} = dir({c: column, r: row}, i);

    if (
      c<0 ||
      c>=boardWidth ||
      r<0 ||
      r>=(squares.length/boardWidth)
    ) {
      break;
    }

    const pos = c+r*boardWidth;
    const sqr = squares[pos];
    if (sqr == (turn == 'X' ? 'O' : 'X')) {
      potencialSqrs = potencialSqrs.concat(pos);
    } else {
      if (sqr == turn) {
        return potencialSqrs;
      }
      break;
    }
  }
  return [];
}

function calculateSquares(gameState, square) {
  const {squares, turn, boardWidth} = gameState;

  const column = square%boardWidth;
  const row = Math.floor(square/boardWidth);

  let revSquares = [
    ({c, r}, i) => ({c: c+i, r: r}),
    ({c, r}, i) => ({c: c-i, r: r}),
    ({c, r}, i) => ({c: c, r: r+i}),
    ({c, r}, i) => ({c: c, r: r-i}),
    ({c, r}, i) => ({c: c+i, r: r+i}),
    ({c, r}, i) => ({c: c+i, r: r-i}),
    ({c, r}, i) => ({c: c-i, r: r+i}),
    ({c, r}, i) => ({c: c-i, r: r-i}),
  ].flatMap((x) => calculateSquaresDir(gameState, square, x))
  
  return(revSquares);
}
