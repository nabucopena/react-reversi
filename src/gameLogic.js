export function winning(squares) {
  const xs = squares.filter(x => x == 'X').length;
  const os = squares.filter(x => x == 'O').length;
  const winner = (os>xs ? 'O' : xs>os ? 'X' : 'draw')
  return (winner)
}



export function playTurn(gameState, square) {
  const result = gameState.squares[square] || gameState.turn == 'ended' ? gameState : move(gameState, square);
  return (result)
}

export function botMove(gameState) {
  const points = gameState.squares.map(
    (x, i) => (
      !x && calculateSquares(
        gameState, i
      ).length
    )
  );
  const result = points.reduce( (bestIndex, currentValue, currentIndex) => (currentValue > points[bestIndex] ? currentIndex : bestIndex), 0);
  
  return result
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
