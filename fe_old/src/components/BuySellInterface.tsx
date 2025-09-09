import React, { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { AnchorClient } from '../utils/anchor';
import { TransactionType } from '../types';
import { formatSOL, formatUSDC, parseSOL, parseUSDC, MAX_SOL_AMOUNT, LAMPORTS_PER_USDC_UNIT } from '../utils/format';
import { ShoppingCart, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';
import './BuySellInterface.css';

export const BuySellInterface: React.FC = () => {
  const { connection } = useConnection();
  const { wallet, publicKey } = useWallet();
  const [activeTab, setActiveTab] = useState<TransactionType>('buy');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userBalance, setUserBalance] = useState<{ sol: number; usdc: number }>({ sol: 0, usdc: 0 });

  // Fetch user balances
  useEffect(() => {
    const fetchBalances = async () => {
      if (!publicKey) {
        setUserBalance({ sol: 0, usdc: 0 });
        return;
      }

      try {
        const solBalance = await connection.getBalance(publicKey);
        setUserBalance(prev => ({ ...prev, sol: solBalance }));
      } catch (err) {
        console.error('Error fetching SOL balance:', err);
      }
    };

    fetchBalances();
  }, [publicKey, connection]);

  const validateAmount = (value: string): string | null => {
    if (!value || value === '') {
      return 'Amount is required';
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) {
      return 'Amount must be a positive number';
    }

    if (activeTab === 'buy') {
      const solAmount = parseSOL(value);
      if (solAmount > MAX_SOL_AMOUNT) {
        return `Maximum 2 SOL per transaction (${formatSOL(MAX_SOL_AMOUNT)} SOL)`;
      }
      if (solAmount > userBalance.sol) {
        return `Insufficient SOL balance. You have ${formatSOL(userBalance.sol)} SOL`;
      }
    } else {
      const usdcAmount = parseUSDC(value);
      if (usdcAmount > userBalance.usdc) {
        return `Insufficient USDC balance. You have ${formatUSDC(userBalance.usdc)} USDC`;
      }
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!wallet || !publicKey) {
      setError('Please connect your wallet');
      return;
    }

    const validationError = validateAmount(amount);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const client = new AnchorClient(connection, wallet.adapter);
      let txSignature: string;

      if (activeTab === 'buy') {
        const solAmount = parseSOL(amount);
        // Convert SOL to USDC: 1 USDC = 0.01 SOL, so 1 SOL = 100 USDC
        const usdcAmount = Math.floor(solAmount / LAMPORTS_PER_USDC_UNIT);
        txSignature = await client.buyUSDC(usdcAmount);
        setSuccess(`Successfully bought ${formatUSDC(usdcAmount)} USDC for ${amount} SOL!`);
      } else {
        const usdcAmount = parseUSDC(amount);
        txSignature = await client.sellUSDC(usdcAmount);
        const solReceived = (usdcAmount * LAMPORTS_PER_USDC_UNIT) / 1e9;
        setSuccess(`Successfully sold ${amount} USDC for ${solReceived.toFixed(4)} SOL!`);
      }

      console.log('Transaction signature:', txSignature);
      
      // Clear form
      setAmount('');
      
      // Refresh balances
      const solBalance = await connection.getBalance(publicKey);
      setUserBalance(prev => ({ ...prev, sol: solBalance }));
      
    } catch (err: any) {
      console.error('Transaction failed:', err);
      setError(err.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    setError(null);
    setSuccess(null);
  };

  const handleTabChange = (tab: TransactionType) => {
    setActiveTab(tab);
    setAmount('');
    setError(null);
    setSuccess(null);
  };

  const getMaxAmount = () => {
    if (activeTab === 'buy') {
      const maxSol = Math.min(MAX_SOL_AMOUNT, userBalance.sol);
      return formatSOL(maxSol);
    } else {
      return formatUSDC(userBalance.usdc);
    }
  };

  const setMaxAmount = () => {
    setAmount(getMaxAmount());
  };

  const getEquivalentAmount = () => {
    if (!amount || isNaN(parseFloat(amount))) return '';
    
    if (activeTab === 'buy') {
      const solAmount = parseSOL(amount);
      const usdcAmount = solAmount / LAMPORTS_PER_USDC_UNIT;
      return `≈ ${formatUSDC(usdcAmount)} USDC`;
    } else {
      const usdcAmount = parseUSDC(amount);
      const solAmount = (usdcAmount * LAMPORTS_PER_USDC_UNIT) / 1e9;
      return `≈ ${solAmount.toFixed(4)} SOL`;
    }
  };

  if (!wallet) {
    return (
      <div className="card buy-sell-interface">
        <h2>
          <ShoppingCart className="icon" />
          Buy/Sell USDC
        </h2>
        <div className="wallet-required">
          <AlertCircle className="alert-icon" />
          <p>Please connect your wallet to start trading</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card buy-sell-interface">
      <h2>
        <ShoppingCart className="icon" />
        Buy/Sell USDC
      </h2>

      <div className="buy-sell-tabs">
        <button
          className={`tab ${activeTab === 'buy' ? 'active' : ''}`}
          onClick={() => handleTabChange('buy')}
        >
          Buy USDC
        </button>
        <button
          className={`tab ${activeTab === 'sell' ? 'active' : ''}`}
          onClick={() => handleTabChange('sell')}
        >
          Sell USDC
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="amount">
            {activeTab === 'buy' ? 'SOL Amount' : 'USDC Amount'}
          </label>
          <div className="input-group">
            <input
              id="amount"
              type="number"
              step="0.0001"
              value={amount}
              onChange={handleAmountChange}
              placeholder={activeTab === 'buy' ? '0.0000' : '0.00'}
              className={error ? 'error' : ''}
              disabled={loading}
            />
            <button
              type="button"
              onClick={setMaxAmount}
              className="max-button"
              disabled={loading}
            >
              MAX
            </button>
          </div>
          {error && <div className="error-message">{error}</div>}
          {amount && !error && (
            <div className="equivalent-amount">
              {getEquivalentAmount()}
            </div>
          )}
        </div>

        <div className="balance-info">
          <div className="balance-item">
            <DollarSign className="balance-icon" />
            <span>SOL Balance: {formatSOL(userBalance.sol)}</span>
          </div>
          <div className="balance-item">
            <DollarSign className="balance-icon" />
            <span>USDC Balance: {formatUSDC(userBalance.usdc)}</span>
          </div>
        </div>

        {success && (
          <div className="success-message">
            <CheckCircle className="success-icon" />
            {success}
          </div>
        )}

        <button
          type="submit"
          className={`button ${activeTab === 'buy' ? 'primary' : 'secondary'}`}
          disabled={loading || !amount || !!error}
        >
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              Processing...
            </div>
          ) : (
            `${activeTab === 'buy' ? 'Buy' : 'Sell'} USDC`
          )}
        </button>
      </form>

      <div className="trading-info">
        <h4>Trading Information</h4>
        <ul>
          <li>Exchange Rate: 1 USDC = 0.01 SOL</li>
          <li>Maximum buy per transaction: 2 SOL</li>
          <li>Network: Solana Devnet</li>
          <li>All transactions are final</li>
        </ul>
      </div>
    </div>
  );
};

