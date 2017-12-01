import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';


function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function HotSquare(props) {
  return <button className="square" onClick={props.onClick}>{props.value}</button>;
}

class Board extends React.Component {
  constructor() {
    super();

    this.state = {
      hotSquareClickCount: 0,
    };
  }

  resetHotSquareClickCount() {
    this.state.hotSquareClickCount = 0;
  }

  incrementHotSquareClickCount() {
    this.state.hotSquareClickCount = ++this.state.hotSquareClickCount;
    if (this.state.hotSquareClickCount === 10) {
      this.props.unlockForms();
      this.state.hotSquareClickCount = 0;
    }
  }

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderHotSquare(i) {
    return (
      <HotSquare
        value={this.props.squares[i]}
        onClick={() => {
          this.incrementHotSquareClickCount();
          this.props.onClick(i);
        }}
      />);
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderHotSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([
        {
          squares,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  onReset() {
    this.setState({
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = `Winner: ${winner}`;
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <div className="game-info">
            <div>{status}</div>
          </div>

          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            unlockForms={this.props.unlockForms}
          />
          <span><button onClick={this.onReset.bind(this)}>reset</button></span>
        </div>


      </div>
    );
  }
}


export default Game;


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
      return squares[a];
    }
  }
  return null;
}
