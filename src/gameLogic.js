export function winning(squares) {
  const xs = squares.filter(x => x == 'X').length;
  const os = squares.filter(x => x == 'O').length;
  const winner = (os>xs ? 'O' : xs>os ? 'X' : 'draw')
  return (winner)
}



export function playTurn(props) {
  const result = props.squares[props.square] != '•' || props.turn == 'ended' ? props : handleClick(props);
  return (result)
}


function somePossibleMove(props) {
  return true;
}


function handleClick (props) { 
  const {squares, square, turn, boardWidth} = props;
  const newBoard = [...squares];
  newBoard[square] = turn;
  const noTurn = turn == 'X' ? 'O' : 'X';
  const newTurn = somePossibleMove({squares: newBoard, turn: noTurn}) ? noTurn : somePossibleMove({squares: newBoard, turn: turn}) ? turn : 'ended';
  calculateSquares(props).forEach((x) => {newBoard[x] = turn});


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

  let revSquares = [].concat(
    calculateSquaresDir(
      {
        props: props,
        dir: function ({c, r}, i) {
          return( {c: c+i, r: r} )
        } 
      }
    ).concat(
      calculateSquaresDir(
        { 
          props: props, 
          dir: function ({c, r}, i) {
            return( {c: c-i, r: r} )
          }
        }
      )
    ).concat(
      calculateSquaresDir(
        { 
          props: props, 
          dir: function ({c, r}, i) {
            return( {c: c, r: r+i} )
          }
        }
      )
    ).concat(
      calculateSquaresDir(
        { 
          props: props, 
          dir: function ({c, r}, i) {
            return( {c: c, r: r-i} )
          }
        }
      )
    ).concat(
      calculateSquaresDir(
        {
          props: props,
          dir: function ({c, r}, i) {
            return( {c: c+i, r: r+i} )
          }
        }
      )
    ).concat(
      calculateSquaresDir(
        {
          props: props,
          dir: function ({c, r}, i) {
            return( {c: c+i, r: r-i} )
          }
        }
      )
    ).concat(
      calculateSquaresDir(
        {
          props: props,
          dir: function ({c, r}, i) {
            return( {c: c-i, r: r+i} )
          }
        }
      )
    ).concat(
      calculateSquaresDir(
        {
          props: props,
          dir: function ({c, r}, i) {
            return( {c: c-i, r: r-i} )
          }
        }
      )
    )
  );
  
  return(revSquares);
}
