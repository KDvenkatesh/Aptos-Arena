import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { CSSProperties } from 'react';

// All components and logic are in this single file as per the one-file mandate.

// Define types for a better TypeScript experience
interface Wallet {
  name: string;
  icon: string;
}

interface Game {
  title: string;
  description: string;
  image: string;
  howToPlay: string[];
  component: string;
}

type GameProps = { onBack: () => void };




// Main App Component
const App: React.FC = () => {
  // Send 0.001 APT to the player wallet
  const sendAptosReward = async (toAddress: string) => {
    if (!(window as any).aptos || !account?.address) {
      setError("Wallet not connected");
      return;
    }
    try {
      // 0.001 APT in Octas (1 APT = 1e8 Octas)
      const amount = 100000;
      const payload = {
        type: "entry_function_payload",
        function: "0x1::aptos_account::transfer",
        arguments: [toAddress, amount],
        type_arguments: [],
      };
      await (window as any).aptos.signAndSubmitTransaction(payload);
      // Optionally, you can wait for confirmation here
      // Show a success message or handle UI feedback
    } catch (err: any) {
      setError(err.message || "Failed to send reward");
    }
  };

  // Wallet connection state and logic (must be inside component)
  const [connected, setConnected] = useState<boolean>(false);
  const [account, setAccount] = useState<{ address: string } | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const connectPetraWallet = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      if (!(window as any).aptos) {
        throw new Error('Petra wallet not found. Please install the Petra extension.');
      }
      const response = await (window as any).aptos.connect();
      if (response && response.address) {
        setConnected(true);
        setAccount({ address: response.address });
        setCurrentPage('game-selection'); // Move to game selection after connect
      } else {
        throw new Error('Failed to connect to Petra wallet.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet.');
      setConnected(false);
      setAccount(null);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setConnected(false);
    setAccount(null);
    setError(null);
  };

  const [showWalletOptions, setShowWalletOptions] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<string>('wallet-connect'); // 'wallet-connect', 'game-selection', or 'game-play'
  const [currentGameIndex, setCurrentGameIndex] = useState<number>(0);
  const [animationState, setAnimationState] = useState<string>('entering');
  const [animationDirection, setAnimationDirection] = useState<string>('next');

  const handleConnect = (): void => {
    setShowWalletOptions(true);
  };

  const handleWalletSelect = (walletName: string): void => {
    setShowWalletOptions(false);
    if (walletName === 'Petra') {
      connectPetraWallet();
    } else {
      setError('Only Petra wallet is supported in this demo.');
    }
  };

  const truncateAddress = (address: string | null): string => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const wallets: Wallet[] = [
  { name: 'Petra', icon: '💎' },
  ];

  const games: Game[] = [
    {
      title: 'DICE ROLL',
      description: 'Test your luck against the odds. Roll the dice and win big!',
      image: 'https://img.freepik.com/premium-vector/dice-purple-retro-background-two-dice-casino-gambling-template-concept-winner-bet-casino-illustration_257312-386.jpg',
      howToPlay: [
        'Place your wager and click "Roll the Dice" to see your outcome.',
        'If your roll is a 6, you win the jackpot!',
        'Good luck, adventurer.'
      ],
      component: 'DiceRoll'
    },
    {
        title: 'MYSTERY BOX',
        description: 'Open a mysterious box and discover what lies inside. Luck is your only guide.',
        image: 'https://realpopmania.com/cdn/shop/products/1_f3029196-1ed1-4198-a742-3edc2845ddb3.webp?v=1672579927',
        howToPlay: [
            'Click on the box to reveal your prize. It could be a reward or a booby prize.',
            'Each box has a different rarity level with a unique reward.',
            'Open wisely and try to uncover the best rewards.'
        ],
        component: 'MysteryBox'
    },
    {
      title: 'ROCK, PAPER, SCISSORS',
      description: 'Challenge the computer to a classic game of strategy and luck.',
      image: 'https://static.vecteezy.com/system/resources/previews/000/691/497/non_2x/rock-paper-scissors-neon-icons-vector.jpg',
      howToPlay: [
        'Choose rock, paper, or scissors to play against the computer.',
        'Rock crushes scissors, scissors cuts paper, and paper covers rock.',
        'Try to beat the computer and win the match!'
      ],
      component: 'RockPaperScissors'
    },
    {
        title: 'MEMORY MATCH',
        description: 'Test your memory skills. Match all the pairs before time runs out!',
        image: 'https://cdn.phaser.io/news/2021/02/memory-match-tutorial-part-1-thumb.png',
        howToPlay: [
            'Click on a card to reveal its symbol.',
            'Click on a second card to find a match. If they match, they stay flipped.',
            'If they do not match, they flip back over. Match all pairs to win.'
        ],
        component: 'MemoryMatch'
    },
    {
        title: 'TIC-TAC-TOE',
        description: 'The classic game. Play against the computer or another player.',
        image: 'https://images.pond5.com/4k-purple-and-pink-tic-footage-275130416_iconl.jpeg',
        howToPlay: [
            'Click on an empty square to place your symbol (X or O).',
            'The first player to get three of their symbols in a row wins.',
            'If the board is full and no one has won, it is a draw.'
        ],
        component: 'TicTacToe'
    }
  ];

  const handlePrevGame = (): void => {
    setAnimationState('exiting');
    setAnimationDirection('prev');
    setTimeout(() => {
      setCurrentGameIndex((prevIndex) => (prevIndex === 0 ? games.length - 1 : prevIndex - 1));
      setAnimationState('entering');
    }, 500); // Wait for the transition to finish
  };

  const handleNextGame = (): void => {
    setAnimationState('exiting');
    setAnimationDirection('next');
    setTimeout(() => {
      setCurrentGameIndex((prevIndex) => (prevIndex === games.length - 1 ? 0 : prevIndex + 1));
      setAnimationState('entering');
    }, 500); // Wait for the transition to finish
  };

  const handlePlayGame = (): void => {
    setCurrentPage('game-play');
  };

  const renderContent = (): React.ReactNode => {
    if (currentPage === 'wallet-connect') {
      return (
        <div style={styles.walletContainer}>
          {/* Dapp Title & Logo */}
          <div style={styles.walletTitle}>
            <svg /* ...existing code... */></svg>
            <h1 style={styles.walletTitleText} className="wallet-title-text">
              APTOS ARENA
            </h1>
          </div>
          <p style={styles.walletDescription} className="wallet-description">
            Welcome, adventurer. Connect your wallet to enter the arena and begin your quest.
          </p>

          {!connected && !showWalletOptions && (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                style={styles.connectButton}
              >
                <div style={connectButtonBg(isConnecting)}></div>
                <span style={styles.connectButtonText}>
                  {isConnecting ? 'CONNECTING...' : 'CONNECT WALLET'}
                </span>
              </button>
            </div>
          )}

          {showWalletOptions && (
            <div style={styles.walletOptionsContainer}>
              <h2 style={styles.walletOptionsTitle}>Choose your wallet:</h2>
              <button
                onClick={() => handleWalletSelect('Petra')}
                style={styles.walletOptionButton}
              >
                <span style={styles.walletOptionIcon}>💎</span>
                <span style={styles.walletOptionText}>Petra</span>
              </button>
              <button
                onClick={() => setShowWalletOptions(false)}
                style={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          )}

          {isConnecting && !connected && (
            <div style={styles.connectingMessageContainer}>
              <span style={styles.connectingMessageText}>Connecting...</span>
            </div>
          )}
        </div>
      );
    } else if (currentPage === 'game-selection') {
      const currentGame: Game = games[currentGameIndex];
      return (
        <div style={styles.gameSelectionContainer}>
          <div style={styles.header}>
            <div style={styles.addressInfo}>
              <p style={styles.addressLabel}>Your Address</p>
              <p style={styles.addressText} className="address-text">
                {account ? truncateAddress(account.address) : ''}
              </p>
              <button
                onClick={() => { disconnectWallet(); setCurrentPage('wallet-connect'); }}
                style={styles.disconnectButton}
              >
                Disconnect
              </button>
            </div>
            <div style={styles.gameHubTitle}>
              <h2 style={styles.gameHubTitleText} className="game-hub-title-text">
                GAMES HUB
              </h2>
            </div>
          </div>
          <div style={styles.gameContentWrapper} className="game-content-wrapper">
            {/* Left Arrow Button */}
            <button
              onClick={handlePrevGame}
              style={arrowButton('left')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            {/* Left Side: Game Card */}
            <div style={styles.gameCardContainer}>
              {/* Game Card */}
              <div 
                key={currentGame.title}
                className={`game-card-base ${animationState === 'exiting' ? 'game-card-transition-exiting-' + animationDirection : 'game-card-transition-entering'}`}
              >
                <img src={currentGame.image} alt={currentGame.title} style={styles.gameCardImage} />
                <h3 style={styles.gameCardTitle}>{currentGame.title}</h3>
                <p style={styles.gameCardDescription}>{currentGame.description}</p>
                <button
                  onClick={handlePlayGame}
                  style={styles.playNowButton}
                >
                  <div style={styles.playNowButtonBg}></div>
                  <span style={styles.playNowButtonText}>PLAY NOW</span>
                </button>
              </div>
            </div>
            {/* Right Side: How to Play */}
            <div 
              className={`how-to-play-base ${animationState === 'exiting' ? 'how-to-play-transition-exiting-' + animationDirection : 'how-to-play-transition-entering'}`}
              style={howToPlayContainer(animationState, animationDirection)}
            >
              <h3 style={styles.howToPlayTitle}>
                How to Play
              </h3>
              <ul style={styles.howToPlayList}>
                {currentGame.howToPlay.map((point: string, index: number) => (
                  <li key={index}>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            {/* Right Arrow Button */}
            <button
                onClick={handleNextGame}
                style={arrowButton('right')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
          </div>
        </div>
      );
    } else if (currentPage === 'game-play') {
      const selectedGame: Game = games[currentGameIndex];
      switch (selectedGame.component) {
        case 'DiceRoll':
          return <DiceRollGame onBack={() => setCurrentPage('game-selection')} playerAddress={account?.address} sendReward={sendAptosReward} />;
        case 'MysteryBox':
          return <MysteryBoxGame onBack={() => setCurrentPage('game-selection')} />;
        case 'RockPaperScissors':
          return <RockPaperScissorsGame onBack={() => setCurrentPage('game-selection')} playerAddress={account?.address} sendReward={sendAptosReward} />;
        case 'MemoryMatch':
          return <MemoryMatchGame onBack={() => setCurrentPage('game-selection')} />;
        case 'TicTacToe':
          return <TicTacToeGame onBack={() => setCurrentPage('game-selection')} />;
        default:
          return <div style={{ color: 'red', textAlign: 'center' }}>Game not found.</div>;
      }
    }
    return null;
  };

  return (
    <div style={styles.appContainer}>
      <style>
        {`
        body { margin: 0; padding: 0; box-sizing: border-box; font-family: sans-serif; }
        .app-bg {
          background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGUdSwCWNg8IcfKJTxAKE-xn7vuf8ksGA_Eg&s);
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          min-height: 100vh;
          color: #e2e8f0;
          padding: 4rem 1rem;
        }

        /* --- Base Styles for Animated Elements --- */
        .game-card-base {
          width: 100%;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          background-color: rgba(17, 24, 39, 0.8);
          border-radius: 0.75rem;
          border: 1px solid #374151;
          padding: 1.5rem;
          gap: 1rem;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .how-to-play-base {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 1.5rem;
          height: 100%;
          text-align: center;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* --- Animations for page transitions --- */
        .game-card-transition-entering {
          opacity: 1;
          transform: none;
        }
        .game-card-transition-exiting-next {
          opacity: 0;
          transform: translateX(150%) scale(0.75);
        }
        .game-card-transition-exiting-prev {
          opacity: 0;
          transform: translateX(-150%) scale(0.75);
        }
        .how-to-play-transition-entering {
          opacity: 1;
          transform: translateX(0);
        }
        .how-to-play-transition-exiting-next {
          opacity: 0;
          transform: translateX(-50%);
        }
        .how-to-play-transition-exiting-prev {
          opacity: 0;
          transform: translateX(50%);
        }
        .button-gradient {
          background-image: linear-gradient(to right, #7a00ff, #00f7ff);
        }
        .button-hover-effect:hover {
          transform: scale(1.05);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        
        /* --- Responsive Styles (formerly in inline JS) --- */
        .wallet-title-text { font-size: 3rem; }
        .wallet-description { font-size: 0.875rem; }
        .address-text { font-size: 1.125rem; }
        .game-hub-title-text { font-size: 2.25rem; }
        .game-title { font-size: 3rem; }
        @media (min-width: 640px) {
          .wallet-title-text { font-size: 4rem; }
          .wallet-description { font-size: 1rem; }
          .address-text { font-size: 1.25rem; }
          .game-hub-title-text { font-size: 3rem; }
          .game-title { font-size: 3rem; }
        }

        @media (min-width: 768px) {
          .game-content-wrapper { flex-direction: row; gap: 0; }
        }

        .game-card-transition {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .how-to-play-transition {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }

        /* --- New RPS Animation Keyframes --- */
        @keyframes reveal-animation {
          0%, 100% { content: '🪨'; }
          33% { content: '📄'; }
          66% { content: '✂'; }
        }
        
        .computer-revealing::before {
          content: ' ';
          animation: reveal-animation 0.75s steps(3, end) infinite;
          font-size: 3rem;
          color: white;
        }

        `}
      </style>
      <div style={styles.appWrapper}>
        {renderContent()}
        {error && (
            <div style={styles.errorText}>
              Error: {error}
            </div>
        )}
      </div>
    </div>
  );
};

const connectButtonBg = (isConnecting: boolean): CSSProperties => ({
  position: 'absolute',
  inset: '0',
  backgroundImage: 'linear-gradient(to right, #8b5cf6, #2dd4bf)',
  transform: 'scale(1)',
  transition: 'transform 0.3s',
  opacity: isConnecting ? 0.5 : 1,
});

const arrowButton = (direction: string): CSSProperties => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  [direction]: 0,
  padding: '0.75rem',
  color: 'white',
  borderRadius: '9999px',
  backgroundColor: 'rgba(31, 41, 55, 0.5)',
  transition: 'background-color 0.2s',
  zIndex: 10,
  border: 'none',
  cursor: 'pointer',
});

// --- PATCH: Move howToPlayContainer out of styles and update usages ---
const howToPlayContainer = (state: string, direction: string): CSSProperties => {
  let transform = 'translateX(0)';
  let opacity = 1;
  if (state === 'exiting') {
    opacity = 0;
    transform = direction === 'next' ? 'translateX(-50%)' : 'translateX(50%)';
  }
  return {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    padding: '1.5rem',
    height: '100%',
    opacity: opacity,
    transform: transform,
    textAlign: 'center',
  };
};

const styles: { [key: string]: CSSProperties } = {
  appContainer: {
    minHeight: '100vh',
    color: '#e2e8f0',
    fontFamily: 'sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '3rem 1rem',
    backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGUdSwCWNg8IcfKJTxAKE-xn7vuf8ksGA_Eg&s)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
  appWrapper: {
    width: '100%',
    maxWidth: '96rem',
    padding: '1rem',
  },
  errorText: {
    marginTop: '1rem',
    color: '#ef4444',
    fontSize: '0.875rem',
    fontWeight: '500',
    textAlign: 'center',
  },
  
  // Wallet Connect Page Styles
  walletContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '1.5rem',
  },
  walletTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    justifyContent: 'center', // Center horizontally
    width: '100%',
    textAlign: 'center',
  },
  walletTitleText: {
    fontWeight: '800',
    letterSpacing: '0.05em',
    color: 'transparent',
    backgroundImage: 'linear-gradient(to right, #2dd4bf, #8b5cf6)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    margin: 0,
  },
  walletDescription: {
    color: '#9ca3af',
    maxWidth: '24rem',
  },
  connectButton: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.75rem 2rem',
    fontSize: '1.125rem',
    fontWeight: '700',
    color: 'white',
    backgroundColor: '#4b5563', // Ensures text is visible
    transition: 'all 0.3s',
    overflow: 'hidden',
    borderRadius: '9999px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    border: 'none',
    cursor: 'pointer',
  },
  connectButtonText: {
    position: 'relative',
    zIndex: 10,
    color: 'white', // Ensure text is white and visible
    fontWeight: 'bold',
    textShadow: '0 1px 4px rgba(0,0,0,0.7)', // Add shadow for contrast
  },
  walletOptionsContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  walletOptionsTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#d1d5db',
  },
  walletOptionButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    backgroundColor: '#1f2937',
    borderRadius: '0.5rem',
    border: '1px solid #374151',
    transition: 'background-color 0.2s',
    cursor: 'pointer',
  },
  walletOptionIcon: {
    fontSize: '1.5rem',
    marginRight: '1rem',
  },
  walletOptionText: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#e5e7eb',
  },
  cancelButton: {
    width: '100%',
    marginTop: '1rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#6b7280',
    transition: 'color 0.2s',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  connectingMessageContainer: {
    width: '100%',
    textAlign: 'center',
    padding: '0.75rem 0',
  },
  connectingMessageText: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: 'white',
  },

  // Game Selection Page Styles
  gameSelectionContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    position: 'relative',
    height: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '3rem',
  },
  addressInfo: {
    textAlign: 'left',
  },
  addressLabel: {
    fontSize: '0.875rem',
    fontWeight: '300',
    color: '#9ca3af',
    marginBottom: '0.25rem',
  },
  addressText: {
    color: '#2dd4bf',
    letterSpacing: '0.05em',
  },
  disconnectButton: {
    marginTop: '0.5rem',
    padding: '0.25rem 0.75rem',
    fontSize: '0.75rem',
    fontWeight: '600',
    borderRadius: '9999px',
    border: '1px solid #4b5563',
    color: '#9ca3af',
    transition: 'background-color 0.2s',
    backgroundColor: 'transparent',
    cursor: 'pointer',
  },
  gameHubTitle: {
    textAlign: 'right',
  },
  gameHubTitleText: {
    fontWeight: '800',
    letterSpacing: '0.05em',
    color: 'transparent',
    backgroundImage: 'linear-gradient(to right, #2dd4bf, #8b5cf6)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    margin: 0,
  },
  gameContentWrapper: {
  display: 'flex',
  height: '32rem',
  alignItems: 'center',
  justifyContent: 'center', // Center horizontally
  gap: '0.75rem',
  position: 'relative',
  overflow: 'hidden',
  },
  gameCardContainer: {
  position: 'relative',
  flex: '1',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '44rem', // Increased for a much taller box
  minHeight: '38rem',
  maxHeight: '48rem',
  marginLeft: '5rem', // Move the game card box further to the right
  },
  gameCardImage: {
  width: '100%',
  height: '16rem', // Increased from 12rem to 16rem
  objectFit: 'cover',
  borderRadius: '0.5rem',
  },
  gameCardTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'white',
    marginTop: '1rem',
  },
  gameCardDescription: {
    fontSize: '0.875rem',
    color: '#9ca3af',
  },
  playNowButton: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.75rem 2rem',
    fontSize: '1.125rem',
    fontWeight: '700',
    color: 'white',
    transition: 'all 0.3s',
    overflow: 'hidden',
    borderRadius: '9999px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    width: '100%',
    border: 'none',
    cursor: 'pointer',
  },
  playNowButtonBg: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'linear-gradient(to right, #8b5cf6, #2dd4bf)',
    transform: 'scale(1)',
    transition: 'transform 0.3s',
  },
  playNowButtonText: {
    position: 'relative',
    zIndex: 10,
  },
  howToPlayTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'transparent',
    backgroundImage: 'linear-gradient(to right, #2dd4bf, #8b5cf6)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
  },
  howToPlayList: {
    fontSize: '0.875rem',
    color: '#9ca3af',
    gap: '0.5rem',
    lineHeight: '1.6',
    listStyleType: 'disc',
    listStylePosition: 'inside',
    maxHeight: '13rem',
    overflowY: 'auto',
  },

  // Game Play Styles
  gamePlayContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '2rem',
    padding: '1rem',
  },
  gameTitle: {
    fontWeight: '800',
    letterSpacing: '0.05em',
    color: 'transparent',
    backgroundImage: 'linear-gradient(to right, #2dd4bf, #8b5cf6)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
  },

  // Dice Roll Game Styles
  diceGameContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '2rem',
    padding: '1rem',
  },
  dicePrompt: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#d1d5db',
  },
  guessGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: '1rem',
  },
  guessButton: {
    width: '4rem',
    height: '4rem',
    backgroundColor: '#1f2937',
    color: 'white',
    fontSize: '1.5rem',
    fontWeight: '700',
    borderRadius: '0.5rem',
    border: '1px solid #374151',
    transition: 'background-color 0.2s',
    cursor: 'pointer',
  },
  guessedNumberText: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#d1d5db',
  },
  guessedNumberValue: {
    color: '#2dd4bf',
  },
  diceDisplayContainer: {
    width: '8rem',
    height: '8rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1f2937',
    border: '4px solid #374151',
    borderRadius: '1rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    position: 'relative',
  },
  diceDisplay: {
    fontSize: '3rem',
    fontWeight: '700',
    color: 'white',
  },
  diceRolling: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'spin 1s linear infinite',
  },
  winMessage: {
    padding: '1rem',
    backgroundColor: 'rgba(20, 83, 45, 0.5)',
    borderRadius: '0.5rem',
    border: '1px solid #4ade80',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  winText: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#4ade80',
    marginBottom: '0.5rem',
  },
  loseMessage: {
    padding: '1rem',
    backgroundColor: 'rgba(127, 29, 29, 0.5)',
    borderRadius: '0.5rem',
    border: '1px solid #f87171',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  loseText: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#f87171',
    marginBottom: '0.5rem',
  },
  gameButtonsContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  backButton: {
    marginTop: '1.5rem',
    padding: '0.5rem 1.5rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    borderRadius: '9999px',
    border: '1px solid #4b5563',
    color: '#9ca3af',
    transition: 'background-color 0.2s',
    backgroundColor: 'transparent',
    cursor: 'pointer',
  },
};

// Dice Roll Game Component
const DiceRollGame: React.FC<GameProps & { playerAddress?: string; sendReward?: (to: string) => void }> = ({ onBack, playerAddress, sendReward }) => {
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [guessedNumber, setGuessedNumber] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [gameResult, setGameResult] = useState<string | null>(null);

  const handleRollDice = (): void => {
    if (isRolling || guessedNumber === null) return;

    setIsRolling(true);
    setDiceResult(null);
    setGameResult(null);

    // Simulate dice rolling animation
    setTimeout(() => {
      const result = Math.floor(Math.random() * 6) + 1;
      setDiceResult(result);
      setIsRolling(false);
      
      // Check for win/loss
      if (result === guessedNumber) {
        setGameResult('win');
        if (sendReward && playerAddress) sendReward(playerAddress);
      } else {
        setGameResult('lose');
      }
    }, 1500);
  };
  
  const handleGuess = (number: number): void => {
    setGuessedNumber(number);
    setDiceResult(null);
    setGameResult(null);
  };

  const handleReset = (): void => {
    setGuessedNumber(null);
    setDiceResult(null);
    setGameResult(null);
    setIsRolling(false);
  };

  return (
    <div style={styles.diceGameContainer}>
      <h2 style={styles.gameTitle} className="game-title">
        DICE ROLL
      </h2>
      
      {guessedNumber === null ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <p style={styles.dicePrompt}>
            Guess a number from 1 to 6
          </p>
          <div style={styles.guessGrid}>
            {[1, 2, 3, 4, 5, 6].map(num => (
              <button
                key={num}
                onClick={() => handleGuess(num)}
                style={styles.guessButton}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <p style={styles.guessedNumberText}>
            You guessed: <span style={styles.guessedNumberValue}>{guessedNumber}</span>
          </p>
          <div style={styles.diceDisplayContainer}>
            {isRolling ? (
              <div style={styles.diceRolling}>
                <span style={{ fontSize: '3rem' }}>🎲</span>
              </div>
            ) : (
              <span style={styles.diceDisplay}>
                {diceResult === null ? '?' : diceResult}
              </span>
            )}
          </div>
        </div>
      )}

      {gameResult === 'win' && (
        <div style={styles.winMessage}>
          <p style={styles.winText}>YOU WIN!</p>
          
          <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.5rem' }}>The dice rolled the number you guessed. Congratulations!</p>
        </div>
      )}

      {gameResult === 'lose' && (
        <div style={styles.loseMessage}>
          <p style={styles.loseText}>You Lose</p>
          <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.5rem' }}>Better luck next time. The dice did not match your guess.</p>
        </div>
      )}

      <div style={styles.gameButtonsContainer}>
        {guessedNumber !== null && gameResult === null && (
          <button
            onClick={handleRollDice}
            disabled={isRolling}
            style={{ ...styles.connectButton, width: '100%', opacity: isRolling ? 0.5 : 1, cursor: isRolling ? 'not-allowed' : 'pointer' }}
          >
            <div style={connectButtonBg(false)}></div>
            <span style={styles.connectButtonText}>
              {isRolling ? 'ROLLING...' : 'ROLL THE DICE'}
            </span>
          </button>
        )}
        {(gameResult !== null || isRolling) && (
          <button
            onClick={handleReset}
            style={{ ...styles.connectButton, width: '100%', backgroundColor: '#374151', backgroundImage: 'none', transition: 'background-color 0.3s' }}
          >
            <div style={{ ...styles.playNowButtonBg, backgroundImage: 'none', backgroundColor: '#374151', transform: 'scale(1)' }}></div>
            <span style={styles.connectButtonText}>PLAY AGAIN</span>
          </button>
        )}

        <button
          onClick={onBack}
          style={styles.backButton}
        >
          Back to Game Selection
        </button>
      </div>
    </div>
  );
};

// Mystery Box Game Component
const MysteryBoxGame: React.FC<GameProps> = ({ onBack }) => {
  interface Box {
    id: number;
    isBomb: boolean;
    isOpened: boolean;
  }
  
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [gameStatus, setGameStatus] = useState<'playing' | 'win' | 'lose'>('playing');
  const [openedCount, setOpenedCount] = useState<number>(0);

  const initializeGame = useCallback(() => {
    const newBoxes: Box[] = [];
    const bombIndex = Math.floor(Math.random() * 25);
    for (let i = 0; i < 25; i++) {
      newBoxes.push({
        id: i,
        isBomb: i === bombIndex,
        isOpened: false,
      });
    }
    setBoxes(newBoxes);
    setGameStatus('playing');
    setOpenedCount(0);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleBoxClick = (id: number): void => {
    if (gameStatus !== 'playing') {
      return;
    }

    setBoxes(prevBoxes => {
      return prevBoxes.map(box => {
        if (box.id === id && !box.isOpened) {
          if (box.isBomb) {
            setGameStatus('lose');
          } else {
            setOpenedCount(prevCount => prevCount + 1);
            if (openedCount + 1 === 24) {
              setGameStatus('win');
            }
          }
          return { ...box, isOpened: true };
        }
        return box;
      });
    });
  };

  const renderGameStatus = (): React.ReactNode => {
    if (gameStatus === 'win') {
      return (
        <div style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: 'rgba(20, 83, 45, 0.5)', borderRadius: '0.75rem', border: '1px solid #4ade80', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
          <p style={{ fontSize: '2.25rem', fontWeight: '700', color: '#4ade80', marginBottom: '0.5rem' }}>YOU WON!</p>
          <p style={{ fontSize: '1.125rem', color: '#d1d5db' }}>You opened all 24 safe boxes. Congratulations!</p>
          <button
            onClick={initializeGame}
            style={styles.backButton}
          >
            Play Again
          </button>
        </div>
      );
    } else if (gameStatus === 'lose') {
      return (
        <div style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: 'rgba(127, 29, 29, 0.5)', borderRadius: '0.75rem', border: '1px solid #f87171', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
          <p style={{ fontSize: '2.25rem', fontWeight: '700', color: '#f87171', marginBottom: '0.5rem' }}>YOU LOST</p>
          <p style={{ fontSize: '1.125rem', color: '#d1d5db' }}>Oh no! You found the unlucky box.</p>
          <button
            onClick={initializeGame}
            style={styles.backButton}
          >
            Try Again
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={styles.gamePlayContainer}>
      <h2 style={styles.gameTitle} className="game-title">
        MYSTERY BOX
      </h2>
      
      {gameStatus === 'playing' ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <p style={{ fontSize: '1.25rem', color: '#9ca3af' }}>
            Boxes Opened: {openedCount} / 24
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '1rem', padding: '1rem', borderRadius: '0.5rem', backgroundColor: 'rgba(17, 24, 39, 0.8)', border: '1px solid #374151' }}>
            {boxes.map(box => (
              <div
                key={box.id}
                onClick={() => handleBoxClick(box.id)}
                style={{
                  position: 'relative',
                  width: '5rem',
                  height: '5rem',
                  cursor: 'pointer',
                  borderRadius: '0.5rem',
                  border: '2px solid',
                  borderColor: box.isOpened ? (box.isBomb ? '#dc2626' : '#16a34a') : '#374151',
                  transition: 'all 0.3s',
                  backgroundColor: box.isOpened ? (box.isBomb ? '#991b1b' : '#14532d') : '#1f2937',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {!box.isOpened && (
                    <span style={{ fontSize: '1.875rem', color: '#9ca3af' }}>?</span>
                  )}
                  {box.isOpened && box.isBomb && (
                    <span style={{ fontSize: '1.875rem', color: '#fca5a5' }}>💥</span>
                  )}
                  {box.isOpened && !box.isBomb && (
                    <span style={{ fontSize: '1.875rem', color: '#86efac' }}>✅</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        renderGameStatus()
      )}

      <button
        onClick={onBack}
        style={styles.backButton}
      >
        Back to Game Selection
      </button>
    </div>
  );
};

// New Rock, Paper, Scissors Game Component
const RockPaperScissorsGame: React.FC<GameProps & { playerAddress?: string; sendReward?: (to: string) => void }> = ({ onBack, playerAddress, sendReward }) => {
  type Choice = 'rock' | 'paper' | 'scissors' | null;
  const [playerChoice, setPlayerChoice] = useState<Choice>(null);
  const [computerChoice, setComputerChoice] = useState<Choice>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isChoosing, setIsChoosing] = useState<boolean>(false);
  const [isRevealing, setIsRevealing] = useState<boolean>(false);
  
  const choices: Choice[] = ['rock', 'paper', 'scissors'];

  const getEmoji = (choice: Choice): string => {
    switch(choice) {
      case 'rock': return '🪨';
      case 'paper': return '📄';
      case 'scissors': return '✂';
      default: return '❓';
    }
  };

  const handlePlayerChoice = (choice: Choice): void => {
    if (isChoosing || isRevealing) return;
    setIsChoosing(true);
    setPlayerChoice(choice);
    setComputerChoice(null);
    setResult(null);
    
    const randomChoice = choices[Math.floor(Math.random() * choices.length)];
    
    // Start revealing animation after a short delay
    setTimeout(() => {
      setIsChoosing(false);
      setIsRevealing(true);
    }, 500);

    // After animation, set computer's final choice and determine winner
    setTimeout(() => {
      setComputerChoice(randomChoice);
      setIsRevealing(false);
      determineWinner(choice, randomChoice);
    }, 2000); // Duration of the reveal animation
  };

  const determineWinner = (player: Choice, computer: Choice): void => {
    if (player === computer) {
      setResult('It\'s a draw!');
    } else if (
      (player === 'rock' && computer === 'scissors') ||
      (player === 'scissors' && computer === 'paper') ||
      (player === 'paper' && computer === 'rock')
    ) {
      setResult('You win!');
      if (sendReward && playerAddress) sendReward(playerAddress);
    } else {
      setResult('You lose!');
    }
  };

  const handleReset = (): void => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
    setIsChoosing(false);
    setIsRevealing(false);
  };

  return (
    <div style={styles.gamePlayContainer}>
      <h2 style={styles.gameTitle} className="game-title">
        ROCK, PAPER, SCISSORS
      </h2>

      {result ? (
  <div style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: result === 'You win!' ? 'rgba(20, 83, 45, 0.5)' : result === 'You lose!' ? 'rgba(127, 29, 29, 0.5)' : 'rgba(21, 94, 117, 0.5)', borderRadius: '0.75rem', border: `1px solid ${result === 'You win!' ? '#4ade80' : result === 'You lose!' ? '#f87171' : '#22d3ee'}`, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
          <p style={{ fontSize: '2rem', fontWeight: '700', color: result === 'You win!' ? '#4ade80' : result === 'You lose!' ? '#f87171' : '#67e8f9' }}>{result}</p>
          <div style={{ marginTop: '1rem', fontSize: '1.125rem', color: '#d1d5db' }}>
            <p>You chose: <span style={{ fontWeight: 'bold' }}>{getEmoji(playerChoice)}</span></p>
            <p>Computer chose: <span style={{ fontWeight: 'bold' }}>{getEmoji(computerChoice)}</span></p>
          </div>
          <button
            onClick={handleReset}
            style={{...styles.backButton, marginTop: '1rem'}}
          >
            Play Again
          </button>
        </div>
      ) : (
        <>
          <p style={{ fontSize: '1.25rem', color: '#9ca3af' }}>
            Choose your move:
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            {choices.map(choice => (
              <button
                key={choice}
                onClick={() => handlePlayerChoice(choice)}
                disabled={isChoosing || isRevealing}
                style={{
                  width: '6rem',
                  height: '6rem',
                  backgroundColor: '#1f2937',
                  border: '2px solid #4b5563',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  cursor: (isChoosing || isRevealing) ? 'not-allowed' : 'pointer',
                  opacity: (isChoosing || isRevealing) ? 0.5 : 1,
                  transition: 'opacity 0.3s'
                }}
              >
                {getEmoji(choice)}
              </button>
            ))}
          </div>
          {(isChoosing || isRevealing) && 
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '1rem' }}>
                <div style={{ fontSize: '3rem' }}>{getEmoji(playerChoice)}</div>
                <p style={{ fontSize: '1.5rem', color: '#d1d5db' }}>VS</p>
                <div 
                  className={isRevealing ? 'computer-revealing' : ''}
                  style={{
                    width: '6rem', 
                    height: '6rem', 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                    backgroundColor: '#1f2937',
                    border: '2px solid #4b5563',
                    borderRadius: '0.5rem',
                  }}
                >
                  {!isRevealing && <span style={{ fontSize: '3rem' }}>{getEmoji(computerChoice)}</span>}
                </div>
              </div>
              <p style={{ color: '#9ca3af', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
                {isChoosing ? 'Computer is choosing...' : 'Finalizing result...'}
              </p>
            </div>
          }
        </>
      )}

      <button
        onClick={onBack}
        style={{...styles.backButton, marginTop: '2rem'}}
      >
        Back to Game Selection
      </button>
    </div>
  );
};

// Memory Match Game Component
const MemoryMatchGame: React.FC<GameProps> = ({ onBack }) => {
  interface Card {
    id: number;
    symbol: string;
    isFlipped: boolean;
    isMatched: boolean;
  }
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Card symbols
  const symbols: string[] = ['👻', '👾', '👽', '🤖', '👑', '🔮', '⚔', '🛡'];

  useEffect(() => {
    // Initialize the game board
    const shuffledCards: Card[] = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffledCards);
    setMatches(0);
    setFlippedCards([]);
    setIsProcessing(false);
  }, []);

  useEffect(() => {
    if (flippedCards.length === 2) {
      setIsProcessing(true);
      const [firstCard, secondCard] = flippedCards;
      if (cards[firstCard].symbol === cards[secondCard].symbol) {
        // It's a match!
        setMatches(prev => prev + 1);
        setCards(prevCards => {
          const newCards = [...prevCards];
          newCards[firstCard].isMatched = true;
          newCards[secondCard].isMatched = true;
          return newCards;
        });
        setFlippedCards([]);
        setIsProcessing(false);
      } else {
        // Not a match, flip back after a delay
        setTimeout(() => {
          setCards(prevCards => {
            const newCards = [...prevCards];
            newCards[firstCard].isFlipped = false;
            newCards[secondCard].isFlipped = false;
            return newCards;
          });
          setFlippedCards([]);
          setIsProcessing(false);
        }, 1000);
      }
    }
  }, [flippedCards, cards]);

  const handleCardClick = (id: number): void => {
    if (isProcessing || flippedCards.length === 2) return;
    if (cards[id].isFlipped || cards[id].isMatched) return;

    setCards(prevCards => {
      const newCards = [...prevCards];
      newCards[id].isFlipped = true;
      return newCards;
    });

    setFlippedCards(prev => [...prev, id]);
  };

  const handleReset = (): void => {
    // Reset the game
    const shuffledCards: Card[] = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffledCards);
    setMatches(0);
    setFlippedCards([]);
    setIsProcessing(false);
  };

  return (
    <div style={styles.gamePlayContainer}>
      <h2 style={styles.gameTitle} className="game-title">
        MEMORY MATCH
      </h2>
      <p style={{ fontSize: '1.25rem', color: '#9ca3af' }}>Matches: {matches}</p>
      
      {matches === symbols.length ? (
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '2.25rem', fontWeight: '700', color: '#2dd4bf', marginBottom: '1rem' }}>YOU WIN!</p>
          <button
            onClick={handleReset}
            style={styles.connectButton}
          >
            <div style={styles.playNowButtonBg}></div>
            <span style={styles.playNowButtonText}>PLAY AGAIN</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '1rem', padding: '1rem', borderRadius: '0.5rem', backgroundColor: 'rgba(17, 24, 39, 0.8)', border: '1px solid #374151' }}>
          {cards.map((card: Card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              style={{
                position: 'relative',
                width: '4rem',
                height: '4rem',
                cursor: 'pointer',
                transition: 'transform 0.5s',
                transformStyle: 'preserve-3d',
                transform: card.isFlipped ? 'rotateY(180deg)' : 'none',
              }}
            >
              <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', backgroundColor: '#1f2937', borderRadius: '0.5rem', border: '2px solid #4b5563', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.875rem', color: '#9ca3af' }}>?</span>
              </div>
              <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', backgroundColor: '#374151', borderRadius: '0.5rem', border: '2px solid #4b5563', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.875rem', color: card.isMatched ? '#2dd4bf' : 'white' }}>
                  {card.symbol}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
        <button
          onClick={handleReset}
          style={styles.backButton}
        >
          Reset Game
        </button>
        <button
          onClick={onBack}
          style={styles.backButton}
        >
          Back to Game Selection
        </button>
      </div>
    </div>
  );
};

// Tic-Tac-Toe Game Component
const TicTacToeGame: React.FC<GameProps> = ({ onBack }) => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState<boolean>(true);
  const [status, setStatus] = useState<string>('Next player: X');
  const [commentary, setCommentary] = useState<string | null>(null);
  const [isCommenting, setIsCommenting] = useState<boolean>(false);
  const boardRef = useRef< (string | null)[]>(board);
  boardRef.current = board;

  const calculateWinner = (squares: (string | null)[]): string | null => {
    const lines: number[][] = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const getEmptySquares = (squares: (string | null)[]): number[] => {
    return squares
      .map((square, index) => (square === null ? index : null))
      .filter((val): val is number => val !== null);
  };

  const findBestMove = (squares: (string | null)[]): number | null => {
    const emptySquares = getEmptySquares(squares);
    
    // Check for winning move
    for (const i of emptySquares) {
      const newSquares = [...squares];
      newSquares[i] = 'O';
      if (calculateWinner(newSquares) === 'O') {
        return i;
      }
    }

    // Block opponent's winning move
    for (const i of emptySquares) {
      const newSquares = [...squares];
      newSquares[i] = 'X';
      if (calculateWinner(newSquares) === 'X') {
        return i;
      }
    }

    // Take center square if available
    if (emptySquares.includes(4)) {
      return 4;
    }

    // Take any available corner
    const corners = [0, 2, 6, 8];
    const availableCorners = emptySquares.filter(i => corners.includes(i));
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // Take a random available side
    const sides = [1, 3, 5, 7];
    const availableSides = emptySquares.filter(i => sides.includes(i));
    if (availableSides.length > 0) {
      return availableSides[Math.floor(Math.random() * availableSides.length)];
    }
    
    return emptySquares.length > 0 ? emptySquares[0] : null;
  };
  
  const handleComputerMove = useCallback(() => {
    const emptySquares = getEmptySquares(boardRef.current);
    const winner = calculateWinner(boardRef.current);
    if (winner || emptySquares.length === 0) return;

    const move = findBestMove(boardRef.current);
    if (move !== null) {
      const newBoard = boardRef.current.slice();
      newBoard[move] = 'O';
      setBoard(newBoard);
      setXIsNext(true);
    }
  }, []);

  useEffect(() => {
    const winner = calculateWinner(board);
    if (winner) {
      setStatus(`Winner: ${winner}`);
    } else if (board.every(Boolean)) {
      setStatus("It's a draw!");
    } else {
      setStatus(`Next player: ${xIsNext ? 'X (You)' : 'O (Computer)'}`);
      if (!xIsNext) {
        setTimeout(handleComputerMove, 800);
      }
    }
  }, [board, xIsNext, handleComputerMove]);

  const handleClick = (i: number): void => {
    if (calculateWinner(board) || board[i] || !xIsNext) {
      return;
    }
    const newBoard = board.slice();
    newBoard[i] = 'X';
    setBoard(newBoard);
    setXIsNext(false);
    setCommentary(null);
  };

  const getGeminiCommentary = async (): Promise<void> => {
    setIsCommenting(true);
    setCommentary(null);
    const boardState: string = boardRef.current.map(sq => sq || ' ').join('');
    
    // The following is a placeholder for Gemini API integration
    setTimeout(() => {
      setCommentary("(Gemini API integration placeholder: witty commentary would appear here.)");
      setIsCommenting(false);
    }, 1000);
  };

  const resetGame = (): void => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setCommentary(null);
  };

  return (
    <div style={styles.gamePlayContainer}>
      <h2 style={styles.gameTitle} className="game-title">
        TIC-TAC-TOE
      </h2>

      <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#d1d5db' }}>
        {status}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.5rem' }}>
        {board.map((square, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            style={{
              width: '6rem',
              height: '6rem',
              fontWeight: '700',
              fontSize: '3rem',
              backgroundColor: '#1f2937',
              border: '2px solid #4b5563',
              transition: 'background-color 0.2s',
              cursor: 'pointer',
              color: board[i] === 'X' ? '#2dd4bf' : '#8b5cf6',
            }}
          >
            {square}
          </button>
        ))}
      </div>

      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <button
          onClick={getGeminiCommentary}
          disabled={isCommenting || calculateWinner(board) !== null || board.every(Boolean)}
          style={{...styles.connectButton, backgroundColor: '#2dd4bf', backgroundImage: 'none', opacity: isCommenting || calculateWinner(board) !== null || board.every(Boolean) ? 0.5 : 1, cursor: isCommenting || calculateWinner(board) !== null || board.every(Boolean) ? 'not-allowed' : 'pointer'}}
        >
          <span style={styles.connectButtonText}>AI COMMENTARY ✨</span>
        </button>
        <button
          onClick={resetGame}
          style={{ backgroundColor: '#374151', color: 'white', fontWeight: '700', padding: '0.5rem 1rem', borderRadius: '9999px', border: 'none', cursor: 'pointer' }}
        >
          Reset Game
        </button>
      </div>
      
      {isCommenting ? (
        <p style={{ color: '#9ca3af', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite', marginTop: '1rem' }}>Thinking...</p>
      ) : commentary ? (
        <div style={{ width: '100%', maxWidth: '32rem', padding: '1rem', backgroundColor: '#111827', borderRadius: '0.5rem', border: '1px solid #374151' }}>
          <p style={{ fontSize: '1.125rem', color: '#d1d5db', fontStyle: 'italic' }}>"{commentary}"</p>
        </div>
      ) : null}

      <button
        onClick={onBack}
        style={styles.backButton}
      >
        Back to Game Selection
      </button>
    </div>
  );
};

export default App;