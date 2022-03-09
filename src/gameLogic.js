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
