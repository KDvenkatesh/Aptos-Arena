import React from 'react';
import { Wallet } from '../../types/types';
import { styles } from '../../styles/styles'; // Assuming you'll create a styles file in a similar path

interface WalletConnectionProps {
    wallets: Wallet[];
    isConnecting: boolean;
    showWalletOptions: boolean;
    onConnect: () => void;
    onWalletSelect: (walletName: string) => void;
    onCancel: () => void;
}

const WalletConnection: React.FC<WalletConnectionProps> = ({
    wallets,
    isConnecting,
    showWalletOptions,
    onConnect,
    onWalletSelect,
    onCancel,
}) => {
    return (
        <div style={styles.walletContainer}>
            {/* Dapp Title & Logo */}
            <div style={styles.walletTitle}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style={{ stopColor: '#00f7ff', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: '#7a00ff', stopOpacity: 1 }} />
                        </linearGradient>
                    </defs>
                    <path d="M4.5 16.5c-1.5 1.26-2.5 2.52-2.5 3.5 0 1.48 1.43 2.5 3 2.5 1.07 0 2.24-.74 2.5-2" />
                    <path d="M11.7 19.5c-.77-.65-1.95-1.4-3.5-1.4h-.5c-1.5 0-2.85.96-3.5 2.5L7.5 22c.67.43 1.42.75 2.5.75H19c2.25 0 4-1.25 4-2.5 0-.75-.83-1.42-2.5-2.5" />
                    <path d="M19 12.7c-1.5 0-2.85.96-3.5 2.5l-1.64 2.84c-.65 1.12-1.85 1.6-2.5 1.4-1.5 0-2.85-.96-3.5-2.5L4 12" />
                    <path d="M22 6c0-1.25-.83-1.92-2.5-2.5h-8c-1.5 0-2.85.96-3.5 2.5l-1.64 2.84c-.65 1.12-1.85 1.6-2.5 1.4-1.5 0-2.85-.96-3.5-2.5L4 12" />
                    <path d="M12.7 5.7c-.77-.65-1.95-1.4-3.5-1.4h-.5c-1.5 0-2.85.96-3.5 2.5L7.5 9c.67.43 1.42.75 2.5.75H19c2.25 0 4-1.25 4-2.5 0-.75-.83-1.42-2.5-2.5" />
                    <path d="M12.7 19.5c-.77-.65-1.95-1.4-3.5-1.4h-.5c-1.5 0-2.85.96-3.5 2.5L7.5 22c.67.43 1.42.75 2.5.75H19c2.25 0 4-1.25 4-2.5 0-.75-.83-1.42-2.5-2.5" />
                    <path d="M12.7 5.7c-.77-.65-1.95-1.4-3.5-1.4h-.5c-1.5 0-2.85.96-3.5 2.5L7.5 9c.67.43 1.42.75 2.5.75H19c2.25 0 4-1.25 4-2.5 0-.75-.83-1.42-2.5-2.5" />
                </svg>
                <h1 style={styles.walletTitleText} className="wallet-title-text">
                    APTOS ARENA
                </h1>
            </div>
            
            <p style={styles.walletDescription} className="wallet-description">
                Welcome, adventurer. Connect your wallet to enter the arena and begin your quest.
            </p>

            {!showWalletOptions && (
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <button
                        onClick={onConnect}
                        disabled={isConnecting}
                        style={styles.connectButton}
                    >
                        <div style={styles.connectButtonBg(isConnecting)}></div>
                        <span style={styles.connectButtonText}>
                            {isConnecting ? 'CONNECTING...' : 'CONNECT WALLET'}
                        </span>
                    </button>
                </div>
            )}

            {showWalletOptions && (
                <div style={styles.walletOptionsContainer}>
                    <h2 style={styles.walletOptionsTitle}>Choose your wallet:</h2>
                    {wallets.map((wallet: Wallet) => (
                        <button
                            key={wallet.name}
                            onClick={() => onWalletSelect(wallet.name)}
                            style={styles.walletOptionButton}
                        >
                            <span style={styles.walletOptionIcon}>{wallet.icon}</span>
                            <span style={styles.walletOptionText}>{wallet.name}</span>
                        </button>
                    ))}
                    <button
                        onClick={onCancel}
                        style={styles.cancelButton}
                    >
                        Cancel
                    </button>
                </div>
            )}

            {isConnecting && !showWalletOptions && (
                <div style={styles.connectingMessageContainer}>
                    <span style={styles.connectingMessageText}>Connecting...</span>
                </div>
            )}
        </div>
    );
};

export default WalletConnection;