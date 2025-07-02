/*import logo from './logo.svg';
import './App.css';

function Welcome(props){
  return <h2>Welcome, {props.name}!</h2>
}

function App() {
  return (
    <div>
      <Welcome name="Arthur"/>
      <Welcome name="Christian"/>
      <Welcome name="David"/>
    </div>
  );
}

export default App;
*/
/*import {useState} from "react";

function Counter(){
  const[count, setCount] = useState(0);

  function handleClick(){
    setCount(count+1);
  }
  return(
    <div>
      <p>You clicked {count}times</p>
      <button onClick={handleClick}>Click me</button>
    </div>
  )
}

function App(){
  return(
    <div>
      <Counter/>
    </div>
  );
}
export default App
*/

import React, { useState, useRef } from "react";
import "./App.css";

const bananaImg = "https://thumbs.dreamstime.com/b/bunch-bananas-6175887.jpg?w=768";
const chickenImg = "https://thumbs.dreamstime.com/z/full-body-brown-chicken-hen-standing-isolated-white-backgroun-background-use-farm-animals-livestock-theme-49741285.jpg?ct=jpeg";

const BOARD_SIZE = 6;
const TOTAL_TILES = BOARD_SIZE * BOARD_SIZE;
const HALF_TILES = TOTAL_TILES / 2;

function generateBoard() {
  const board = [];
  for (let i = 0; i < HALF_TILES; i++) {
    board.push({ type: "banana", img: bananaImg, revealed: false });
    board.push({ type: "chicken", img: chickenImg, revealed: false });
  }
  for (let i = board.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [board[i], board[j]] = [board[j], board[i]];
  }
  return board;
}

function App() {
  const [tiles, setTiles] = useState([]);
  const [chosenType, setChosenType] = useState(null);
  const [gameLost, setGameLost] = useState(false);
  const [loseMessage, setLoseMessage] = useState("");
  const [streak, setStreak] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef();

  const startGame = (type) => {
    setChosenType(type);
    setTiles(generateBoard());
    setGameLost(false);
    setLoseMessage("");
    setStreak(0);
  };

  const revealTile = (index) => {
    if (gameLost || tiles[index].revealed) return;

    const clickedType = tiles[index].type;

    setTiles((prev) => {
      const newTiles = [...prev];
      newTiles[index].revealed = true;
      return newTiles;
    });

    if (clickedType !== chosenType) {
      setGameLost(true);
      setLoseMessage(
        `You lose! You picked a ${clickedType} tile, but your chosen type is ${chosenType}. Your streak was ${streak}.`
      );
    } else {
      setStreak((prev) => prev + 1);
    }
  };

  const restartGame = () => {
    setChosenType(null);
    setTiles([]);
    setGameLost(false);
    setLoseMessage("");
    setStreak(0);
  };

  const toggleMusic = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="App">
      <h1>🐔 Chicken vs 🍌 Banana</h1>

      <button className="music-button" onClick={toggleMusic}>
        {isPlaying ? "🔊 Pause Music" : "🔈 Play Music"}
      </button>

      <audio ref={audioRef} autoPlay loop>
        <source src="/assets/background.mp3" type="audio/mpeg" />
      </audio>

      {!chosenType ? (
        <div className="choose-type-wrapper">
          <div className="choose-type">
            <h2>Pick your choice:</h2>
            <button className="choice-button" onClick={() => startGame("banana")}>
              🍌 Banana
            </button>
            <button className="choice-button" onClick={() => startGame("chicken")}>
              🐔 Chicken
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="chosen-type">
            Your chosen type: <strong>{chosenType.toUpperCase()}</strong>
          </div>

          <div className="spacer streak-message">
            {streak > 0 ? `Streak: ${streak}` : "\u00A0"}
          </div>

          <div
            className="board"
            style={{
              gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
              gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`,
            }}
          >
            {tiles.map((tile, idx) => (
              <div
                key={idx}
                className={`tile ${tile.revealed ? "revealed" : ""}`}
                onClick={() => revealTile(idx)}
              >
                {tile.revealed ? (
                  <img src={tile.img} alt={tile.type} />
                ) : (
                  <div className="hidden-tile" />
                )}
              </div>
            ))}
          </div>

          <div className="spacer lose-message">
            {gameLost ? loseMessage : "\u00A0"}
          </div>

          <button className="restart-button" onClick={restartGame}>
            Restart Game
          </button>
        </>
      )}
    </div>
  );
}

export default App;



