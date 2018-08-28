// Display the location for each move in the format (col, row) in the move history list. Complete
// Bold the currently selected item in the move list. - Complete
// Rewrite Board to use two loops to make the squares instead of hardcoding them. - Complete
// Add a toggle button that lets you sort the moves in either ascending or descending order. - Complete
// When someone wins, highlight the three squares that caused the win. - Complete
// When no one wins, display a message about the result being a draw. - Complete

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button key={props.id} className={`square ${props.winner ? 'highlight' : null}`} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        id={i}
        key={i}
        winner={this.props.winner.includes(i)}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }
  createTable = () => {
    let table = []
    let count = 0
    for (let i = 0; i < 3; i++) {
      let children = []
      for (let j = 0; j < 3; j++) {
        children.push(this.renderSquare(count))
        count++
      }
      table.push(<div key={table.length} className="board-row">{children}</div>)
  }
  return table
}
  render() {
    return (
      <div>
        {this.createTable()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        position: calculatePosition(props),
      }],
      stepNumber: 0,
      xIsNext: true,
      order: 'dsc',
      winner: [],
    }
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares)  || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        position: calculatePosition(i),
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
    const winner = calculateWinner(squares);
    if (winner) {
      this.setState({winner: winner[1]})
    }
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }
  changeOrder() {
    const order = this.state.order;
    if (order === 'asc') {
      this.setState({order: 'dsc'})
    } else {
      this.setState({order: 'asc'})
    }
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const order = this.state.order;

    const moves = history.map((step, move) => {
    const position = this.state.history[move].position;
    const desc = move ?
        'Go to move #' + move + position :
        'Go to game start';
      return (
          <li key={move}>
            <button className={current === step ? 'current' : ''}
                    onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
      );
    });
    let status;
    if (winner) {
      status = "Winner: " + winner[0];
    } else if (history.length === 10 ) {
      status = 'Its a draw'
    }
     else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winner={this.state.winner}
          />
        </div>
        <div className="game-info">
          <button onClick={() => this.changeOrder()}>{order === 'dsc' ? 'Ascending' : 'Descending'}</button>
          <div>{status}</div>
        <ol reversed={order === 'dsc' ? null : 'reversed' }>{order === 'dsc' ? moves : moves.reverse()}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      const object = [squares[a], lines[i]]
      return (object)
    }
  }
  return null;
}
// extra tasks

function calculatePosition(i) {
  const col = i % 3
  const row = Math.floor(i / 3)
  return (` Col:${col} Row:${row}`)
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
