import React, { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { AnchorClient } from '../utils/anchor';
import { Play, Loader2 } from 'lucide-react';
import './InitializeMarket.css';

export const InitializeMarket: React.FC = () => {
  const { connection } = useConnection();
  const { wallet } = useWallet();
  const [maxSupply, setMaxSupply] = useState<string>('1000000'); // 1M USDC default
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInitialize = async () => {
    if (!wallet?.adapter) {
      setError('Please connect your wallet');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const client = new AnchorClient(connection, wallet.adapter);
      const maxSupplyNumber = parseInt(maxSupply) * Math.pow(10, 6); // Convert to USDC base units
      
      const txSignature = await client.initializeMarket(maxSupplyNumber);
      
      setSuccess(`Market initialized successfully! Transaction: ${txSignature}`);
    } catch (err) {
      console.error('Error initializing market:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize market');
    } finally {
      setLoading(false);
    }
  };

  if (!wallet?.adapter) {
    return (
      <div className="card initialize-market">
        <h2>
          <Play className="icon" />
          Initialize Market
        </h2>
        <p>Please connect your wallet to initialize the market.</p>
      </div>
    );
  }

  return (
    <div className="card initialize-market">
      <h2>
        <Play className="icon" />
        Initialize Market
      </h2>
      <p>Initialize the USDC buy/sell market with a maximum supply.</p>
      
      <div className="form-group">
        <label htmlFor="maxSupply">Maximum USDC Supply:</label>
        <input
          id="maxSupply"
          type="number"
          value={maxSupply}
          onChange={(e) => setMaxSupply(e.target.value)}
          placeholder="1000000"
          min="1"
          disabled={loading}
        />
        <small>Maximum number of USDC tokens that can be sold</small>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      <button
        onClick={handleInitialize}
        disabled={loading || !maxSupply || parseInt(maxSupply) <= 0}
        className="btn btn-primary"
      >
        {loading ? (
          <>
            <Loader2 className="icon spinning" />
            Initializing...
          </>
        ) : (
          <>
            <Play className="icon" />
            Initialize Market
          </>
        )}
      </button>
    </div>
  );
};
