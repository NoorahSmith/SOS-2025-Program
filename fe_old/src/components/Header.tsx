import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { TrendingUp } from 'lucide-react';
import './Header.css';

export const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <TrendingUp className="logo-icon" />
          <h1>USDC Buy/Sell</h1>
        </div>
        <div className="wallet-section">
          <WalletMultiButton />
        </div>
      </div>
    </header>
  );
};

