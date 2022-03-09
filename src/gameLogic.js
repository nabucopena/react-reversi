export function ended(squares) {
  return (!squares.some(x => x == '•'))
}

export function winning(squares) {
  const xs = squares.filter(x => x == 'X').length;
  const os = squares.filter(x => x == 'O').length;
  const winner = (os>xs ? 'O' : xs>os ? 'X' : 'draw')
  return (winner)
}



export function playTurn(props) {
  const result = props.squares[props.square] != '•' ? props : handleClick(props);
  return (result)
}


function handleClick (props) { 
  const {squares, square, turn, boardWidth} = props;
  const newBoard = [...squares];
  newBoard[square] = turn;
  const newTurn = turn == 'X' ? 'O' : 'X' ;
  calculateSquares(props);
  return (
    {
      squares: newBoard,
      turn: newTurn,
    }
  )
}


function calculateSquares(props) {
  const {squares, square, turn, boardWidth} = props;

  const column = square%boardWidth;
  const row = Math.floor(square/boardWidth);

  let revSquares = [];
  let potencialSquares = [];
  for (let i = 1; i < boardWidth; i++) {
    const pos = square-i*boardWidth;
    const sqr = squares[pos];
    if (sqr == (turn == 'X' ? 'O' : 'X')) {
      potencialSquares = potencialSquares.concat(pos);
      console.log( {potencialSquares} )
    } else { 
      if (sqr == turn) {
        revSquares = revSquares.concat(potencialSquares);
      }
      break;
    }
  }
      
        

  console.log(revSquares);
}
