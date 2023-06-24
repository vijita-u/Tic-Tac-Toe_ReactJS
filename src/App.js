import { useState } from 'react';


function NewGameBtn({ onNewGameClick }) {
  return (
    <button id="newGame" onClick={onNewGameClick} >New Game</button>
  )
}

function Square({ value, onsquareClick, winnerStyle }) {
  return (
    <button className='square' onClick={onsquareClick} style={winnerStyle} >{value}</button>
  );
}


function Board({ move, isPlayerX, onPlayGame, gameWinner }) {

  // Creating a click handler function
  function handleClick(i) {
    let newMove = move.slice();  // Creating a new set of squares for keeping track of each move

    if (move[i] || gameWinner) {  // If the current square is not NULL; return
      return;
    }
    else {
      newMove[i] = isPlayerX ? "X" : "O";
    }
    onPlayGame(newMove);
  }

  // Creating a board
  let board_size = [...Array(9).keys()];
  let board = board_size.map((position) => {
    if (gameWinner) {
      let [a, b, c] = gameWinner[1];
      if (position === a || position === b || position === c) {
        return (
          <Square value={move[position]} onsquareClick={() => {handleClick(position)}} winnerStyle={{"backgroundColor": "green", "color": "#fff"}} />
        );
      }
      else {
        return (
          <Square value={move[position]} onsquareClick={() => {handleClick(position)}} winnerStyle={{"backgroundColor": "none"}} />
        )
      }
    }
    return (
      <Square value={move[position]} onsquareClick={() => {handleClick(position)}} winnerStyle={{"backgroundColor": "none"}} />
    )
  });

  return (
    <div className='board'>
      {board}
    </div>
  );
} 


export default function GamePlay() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMoveNum, setCurrentMoveNum] = useState(0);
  const isPlayerX = currentMoveNum % 2 === 0;
  const currentMove = history[currentMoveNum];

  // handler to update state through Board
  function handleGamePlay(newMove) {
    const newHistory = [...history.slice(0, currentMoveNum + 1), newMove];
    setHistory(newHistory);
    setCurrentMoveNum(newHistory.length - 1);
  }

  function jumpTo(moveNum) {
    setCurrentMoveNum(moveNum);
  }

  // Displaying history of moves
  let moves = history.map((move, moveNum) => {
    let description;
    if (moveNum === currentMoveNum && moveNum > 0) {
      description = 'You are at Move #' + moveNum + '!';
    }
    else if (moveNum !== currentMoveNum && moveNum > 0) {
      description = 'Go to Move ' + moveNum;
    }
    else {
      description = 'Go to game start';
    }

    return (
      <li key={moveNum} >
        <button className="history-buttons" onClick={() => jumpTo(moveNum)}>{description}</button>
      </li>
    );
  });

  // Declaring Status
  let winner = declareWinner(currentMove);
  let status;
  if (winner) {
    status = `'${winner[0]}' WON! || Total Moves: ${currentMoveNum}`
    document.querySelector('.current-status').style.backgroundColor = "green";
  }
  else if (isPlayerX) {
    status = `Next Player: "X" || Move ${currentMoveNum + 1}`;
  }
  else if (!isPlayerX) {
    status = `Next Player: "O" || Move ${currentMoveNum + 1}`;
  }

  // Displaying status as Draw!
  let counter = 0;
  currentMove.forEach((square) => {
    if (square !== null) {
      counter ++;
    }

    if (counter === 9 && !winner) {
      status = `It's a DRAW! || Total Moves: ${currentMoveNum} `;
      document.querySelector('.current-status').style.backgroundColor = "yellow";
      document.querySelector('.current-status').style.color = "black";
    }
  })

  function refreshPage() {
    setHistory([Array(9).fill(null)]);
    setCurrentMoveNum(0);
    document.querySelector('.current-status').style.backgroundColor = "#000";
    document.querySelector('.current-status').style.color = "#fff";
    if (winner) {
      let squares = Array.from(document.querySelectorAll('.square'));
      squares.forEach((elem) => {
      if (elem.style.backgroundColor) {
        elem.style.removeProperty('background-color');
      }
    });
    }
  }


  return (
    <div className='Tic-Tac-Toe'>
      <div className='title'>Tic-Tac-Toe</div>
      <NewGameBtn onNewGameClick={refreshPage} />
      <div className='current-status'>{status}</div>
      <div className='completeGame'>
        <div className='board-div'>
          <Board move={currentMove} isPlayerX={isPlayerX} onPlayGame={handleGamePlay} gameWinner={winner} />
        </div>
        <div className='history-div'>
          <ul>{moves}</ul>
        </div>
      </div>
    </div>
  );
}





function declareWinner(move) {
  const probabilties = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  for (let i = 0; i < probabilties.length; i++) {
    let [a, b, c] = probabilties[i];

    if (move[a] && move[a] === move[b] && move[a] === move[c]) {
      return [move[a], [a, b, c]];
    }
  }

  return null;
}