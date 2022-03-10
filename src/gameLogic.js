export function winning(squares) {
  const xs = squares.filter(x => x == 'X').length;
  const os = squares.filter(x => x == 'O').length;
  const winner = (os>xs ? 'O' : xs>os ? 'X' : 'draw')
  return (winner)
}



export function playTurn(props) {
  const result = props.squares[props.square] != '•' || props.turn == 'ended' ? props : move(props);
  return (result)
}


function somePossibleMove(props) {
  const result = props.squares.some(
    (x, i) => (
      x == '•' && calculateSquares(
        {squares: props.squares, square: i, turn: props.turn, boardWidth: props.boardWidth}
      ).length > 0
    )
  );
  return result;
}


function move(props) { 
  const changedSquares = calculateSquares(props)
  if (changedSquares.length < 1) {
    return props
  }  

  const {squares, square, turn, boardWidth} = props;
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

function calculateSquaresDir({props, dir}) {

  const {squares, square, turn, boardWidth} = props;
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

function calculateSquares(props) {
  const {squares, square, turn, boardWidth} = props;

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
  ].flatMap((x) => calculateSquaresDir({props, dir: x}))
  
  return(revSquares);
}
