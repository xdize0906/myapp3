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

import React, { useState, useRef, useEffect } from "react";

const bananaImg =
  "https://thumbs.dreamstime.com/b/bunch-bananas-6175887.jpg?w=768";
const chickenImg =
  "https://thumbs.dreamstime.com/z/full-body-brown-chicken-hen-standing-isolated-white-backgroun-background-use-farm-animals-livestock-theme-49741285.jpg?ct=jpeg";

const BOARD_SIZE = 6;
const TOTAL_TILES = BOARD_SIZE * BOARD_SIZE;
const HALF_TILES = TOTAL_TILES / 2;

function generateBoard() {
  const board = [];
  // Create 18 chickens and 18 bananas
  for (let i = 0; i < HALF_TILES; i++) {
    board.push({ type: "chicken", img: chickenImg, revealed: false });
    board.push({ type: "banana", img: bananaImg, revealed: false });
  }

  // Shuffle the board
  for (let i = board.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [board[i], board[j]] = [board[j], board[i]];
  }

  // Add tile numbers 1-36 after shuffling
  return board.map((tile, index) => ({ ...tile, number: index + 1 }));
}

function App() {
  const [tiles, setTiles] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [waitingForChoices, setWaitingForChoices] = useState(false);
  const [player1Choice, setPlayer1Choice] = useState(null);
  const [player2Choice, setPlayer2Choice] = useState(null);
  const [roundCount, setRoundCount] = useState(0);
  const audioRef = useRef();

  const styles = {
    app: {
      background: '#92de8b',
      borderRadius: '12px',
      boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
      maxWidth: '700px',
      width: '100%',
      padding: '20px',
      textAlign: 'center',
      boxSizing: 'border-box',
      userSelect: 'none',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
    },
    body: {
      minHeight: '100vh',
      background: '#0ab68b',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 0,
      padding: '20px'
    },
    title: {
      fontWeight: 700,
      color: '#333',
      fontSize: '2.4rem',
      marginBottom: '15px'
    },
    musicButton: {
      backgroundColor: '#e1e6f1',
      color: '#333',
      padding: '10px 20px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      marginBottom: '20px',
      transition: 'background-color 0.3s ease'
    },
    playerSelection: {
      display: 'flex',
      justifyContent: 'space-around',
      marginBottom: '30px',
      gap: '20px'
    },
    playerCard: {
      background: 'rgb(236, 232, 164)',
      padding: '20px',
      borderRadius: '16px',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.08)',
      flex: 1,
      maxWidth: '300px'
    },
    playerTitle: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '15px',
      color: '#333'
    },
    choiceButton: {
      fontSize: '16px',
      padding: '12px 24px',
      border: '2px solid rgba(42, 102, 44, 0.8)',
      borderRadius: '8px',
      backgroundColor: '#1f6d21',
      color: 'white',
      fontWeight: '600',
      margin: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease'
    },
    startButton: {
      fontSize: '20px',
      padding: '15px 40px',
      border: '2px solid rgba(42, 102, 44, 0.8)',
      borderRadius: '12px',
      backgroundColor: '#1f6d21',
      color: 'white',
      fontWeight: '700',
      cursor: 'pointer',
      marginTop: '20px',
      transition: 'background-color 0.3s ease'
    },
    gameInfo: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      fontSize: '16px',
      fontWeight: '600'
    },
    currentPlayerIndicator: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#1f6d21',
      padding: '10px 20px',
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      borderRadius: '8px'
    },
    roundInfo: {
      fontSize: '16px',
      fontWeight: '600',
      marginBottom: '15px',
      color: '#333',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      padding: '10px 20px',
      borderRadius: '8px'
    },
    board: {
      display: 'grid',
      gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
      gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`,
      gap: '8px',
      marginBottom: '20px',
      width: '100%',
      height: '500px'
    },
    tile: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#028174',
      borderRadius: '10px',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.08)',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
      userSelect: 'none',
      cursor: 'pointer',
      position: 'relative',
      width: '100%',
      height: '100%',
      minWidth: '0',
      minHeight: '0'
    },
    tileRevealed: {
      cursor: 'default',
      backgroundColor: 'white',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
      border: '1px solid transparent'
    },
    tileImage: {
      width: '80%',
      height: '80%',
      objectFit: 'contain',
      pointerEvents: 'none',
      userSelect: 'none'
    },
    hiddenTile: {
      width: '100%',
      height: '100%',
      backgroundColor: 'transparent',
      borderRadius: '10px',
      userSelect: 'none'
    },
    tileNumber: {
      position: 'absolute',
      top: '5px',
      right: '5px',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '12px',
      padding: '3px 6px',
      borderRadius: '50%',
      minWidth: '20px',
      textAlign: 'center'
    },
    restartButton: {
      marginTop: '20px',
      padding: '10px 28px',
      fontSize: '18px',
      border: '2px solid rgba(67, 160, 71, 0.8)',
      backgroundColor: '#29692d',
      color: 'white',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      boxShadow: '0 3px 6px rgba(67, 160, 71, 0.25)',
      userSelect: 'none'
    },
    winnerMessage: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#1f6d21',
      marginTop: '15px',
      padding: '15px',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '12px',
      border: '3px solid #1f6d21'
    },
    choiceSection: {
      marginTop: '30px',
      padding: '20px',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '12px',
      border: '2px solid #1f6d21'
    }
  };

  const startGame = () => {
    setTiles(generateBoard());
    setGameStarted(true);
    setGameEnded(false);
    setCurrentPlayer(1);
    setPlayer1Score(0);
    setPlayer2Score(0);
    setRoundCount(0);
    setWaitingForChoices(true);
    setPlayer1Choice(null);
    setPlayer2Choice(null);
  };

  const proceedWithChoices = () => {
    if (player1Choice && player2Choice) {
      setWaitingForChoices(false);
      setRoundCount(prev => prev + 1);
    }
  };

  const revealTile = (index) => {
    if (gameEnded || tiles[index].revealed || waitingForChoices) return;

    const clickedType = tiles[index].type;
    const currentChoice = currentPlayer === 1 ? player1Choice : player2Choice;

    setTiles((prev) => {
      const newTiles = [...prev];
      newTiles[index].revealed = true;
      return newTiles;
    });

    // Update scores
    if (clickedType === currentChoice) {
      if (currentPlayer === 1) {
        setPlayer1Score(prev => prev + 1);
      } else {
        setPlayer2Score(prev => prev + 1);
      }
    }

    // Check if all tiles are revealed
    const revealedCount = tiles.filter(tile => tile.revealed).length + 1;
    if (revealedCount === TOTAL_TILES) {
      setGameEnded(true);
      return;
    }

    // Switch to next player
    if (currentPlayer === 1) {
      setCurrentPlayer(2);
    } else {
      // After player 2's turn, ask for new choices
      setCurrentPlayer(1);
      setWaitingForChoices(true);
      setPlayer1Choice(null);
      setPlayer2Choice(null);
    }
  };

  const restartGame = () => {
    setGameStarted(false);
    setTiles([]);
    setGameEnded(false);
    setCurrentPlayer(1);
    setPlayer1Score(0);
    setPlayer2Score(0);
    setWaitingForChoices(false);
    setPlayer1Choice(null);
    setPlayer2Choice(null);
    setRoundCount(0);
  };

  const toggleMusic = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const getWinner = () => {
    if (player1Score > player2Score) return "Player 1 Wins!";
    if (player2Score > player1Score) return "Player 2 Wins!";
    return "It's a tie!";
  };

  return (
    <div style={styles.body}>
      <div style={styles.app}>
        <h1 style={styles.title}>🐔 Chicken vs 🍌 Banana</h1>

        <button 
          style={styles.musicButton} 
          onClick={toggleMusic}
          onMouseEnter={e => e.target.style.backgroundColor = '#ffa726'}
          onMouseLeave={e => e.target.style.backgroundColor = '#e1e6f1'}
        >
          {isPlaying ? "🔊 Pause Music" : "🔈 Play Music"}
        </button>

        <audio ref={audioRef} autoPlay loop>
          <source src="/assets/background.mp3" type="audio/mpeg" />
        </audio>

        {!gameStarted ? (
          <div>
            <button
              style={styles.startButton}
              onClick={startGame}
              onMouseEnter={e => e.target.style.backgroundColor = '#43a047'}
              onMouseLeave={e => e.target.style.backgroundColor = '#1f6d21'}
            >
              Start Game
            </button>
          </div>
        ) : (
          <>
            <div style={styles.gameInfo}>
              <div>
                <strong>Player 1 Score:</strong> {player1Score}
              </div>
              <div style={styles.currentPlayerIndicator}>
                {!gameEnded && !waitingForChoices && `Player ${currentPlayer}'s Turn`}
                {waitingForChoices && `Round ${roundCount + 1} - Choose Categories Below`}
              </div>
              <div>
                <strong>Player 2 Score:</strong> {player2Score}
              </div>
            </div>

            <div style={styles.board}>
              {tiles.map((tile, idx) => (
                <div
                  key={idx}
                  style={{
                    ...styles.tile,
                    ...(tile.revealed ? styles.tileRevealed : {}),
                    backgroundColor: tile.revealed ? 'white' : '#028174'
                  }}
                  onClick={() => revealTile(idx)}
                  onMouseEnter={e => {
                    if (!tile.revealed && !gameEnded && !waitingForChoices) {
                      e.target.style.backgroundColor = '#0a9d8a';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!tile.revealed && !gameEnded && !waitingForChoices) {
                      e.target.style.backgroundColor = '#028174';
                    }
                  }}
                >
                  {tile.revealed ? (
                    <>
                      <img src={tile.img} alt={tile.type} style={styles.tileImage} />
                      <div style={styles.tileNumber}>{tile.number}</div>
                    </>
                  ) : (
                    <>
                      <div style={styles.hiddenTile} />
                      <div style={styles.tileNumber}>{tile.number}</div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {gameEnded && (
              <div style={styles.winnerMessage}>
                🎉 {getWinner()} 🎉
              </div>
            )}

            <button
              style={styles.restartButton}
              onClick={restartGame}
              onMouseEnter={e => {
                e.target.style.backgroundColor = '#388e3c';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={e => {
                e.target.style.backgroundColor = '#29692d';
                e.target.style.transform = 'scale(1)';
              }}
            >
              Restart Game
            </button>

            {/* Choice Selection Section - Now at the bottom */}
            {waitingForChoices && (
              <div style={styles.choiceSection}>
                <h2 style={{marginBottom: '20px', color: '#333'}}>Round {roundCount + 1} - Choose Your Categories</h2>
                <div style={styles.playerSelection}>
                  <div style={styles.playerCard}>
                    <h3 style={styles.playerTitle}>Player 1</h3>
                    <div>
                      <button
                        style={{
                          ...styles.choiceButton,
                          backgroundColor: player1Choice === 'banana' ? '#43a047' : '#1f6d21'
                        }}
                        onClick={() => setPlayer1Choice('banana')}
                        onMouseEnter={e => e.target.style.backgroundColor = '#43a047'}
                        onMouseLeave={e => e.target.style.backgroundColor = player1Choice === 'banana' ? '#43a047' : '#1f6d21'}
                      >
                        🍌 Banana
                      </button>
                      <button
                        style={{
                          ...styles.choiceButton,
                          backgroundColor: player1Choice === 'chicken' ? '#43a047' : '#1f6d21'
                        }}
                        onClick={() => setPlayer1Choice('chicken')}
                        onMouseEnter={e => e.target.style.backgroundColor = '#43a047'}
                        onMouseLeave={e => e.target.style.backgroundColor = player1Choice === 'chicken' ? '#43a047' : '#1f6d21'}
                      >
                        🐔 Chicken
                      </button>
                    </div>
                    {player1Choice && (
                      <div style={{ marginTop: '10px', fontWeight: '600' }}>
                        Choice: {player1Choice.toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div style={styles.playerCard}>
                    <h3 style={styles.playerTitle}>Player 2</h3>
                    <div>
                      <button
                        style={{
                          ...styles.choiceButton,
                          backgroundColor: player2Choice === 'banana' ? '#43a047' : '#1f6d21'
                        }}
                        onClick={() => setPlayer2Choice('banana')}
                        onMouseEnter={e => e.target.style.backgroundColor = '#43a047'}
                        onMouseLeave={e => e.target.style.backgroundColor = player2Choice === 'banana' ? '#43a047' : '#1f6d21'}
                      >
                        🍌 Banana
                      </button>
                      <button
                        style={{
                          ...styles.choiceButton,
                          backgroundColor: player2Choice === 'chicken' ? '#43a047' : '#1f6d21'
                        }}
                        onClick={() => setPlayer2Choice('chicken')}
                        onMouseEnter={e => e.target.style.backgroundColor = '#43a047'}
                        onMouseLeave={e => e.target.style.backgroundColor = player2Choice === 'chicken' ? '#43a047' : '#1f6d21'}
                      >
                        🐔 Chicken
                      </button>
                    </div>
                    {player2Choice && (
                      <div style={{ marginTop: '10px', fontWeight: '600' }}>
                        Choice: {player2Choice.toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>

                {player1Choice && player2Choice && (
                  <button
                    style={styles.startButton}
                    onClick={proceedWithChoices}
                    onMouseEnter={e => e.target.style.backgroundColor = '#43a047'}
                    onMouseLeave={e => e.target.style.backgroundColor = '#1f6d21'}
                  >
                    {roundCount === 0 ? 'Start Round' : 'Continue Round'}
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;