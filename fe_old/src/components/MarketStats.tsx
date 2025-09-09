import React, { useState, useEffect, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { AnchorClient } from '../utils/anchor';
import { MarketStats as MarketStatsType } from '../types';
import { formatSOL, formatUSDC } from '../utils/format';
import { BarChart3, DollarSign, TrendingUp, Wallet } from 'lucide-react';
import './MarketStats.css';

export const MarketStats: React.FC = () => {
  const { connection } = useConnection();
  const { wallet } = useWallet();
  const [stats, setStats] = useState<MarketStatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!wallet) {
      setError('Please connect your wallet');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const client = new AnchorClient(connection, wallet.adapter);
      const marketStats = await client.getMarketStats();
      
      if (marketStats) {
        setStats(marketStats);
      } else {
        setError('Failed to fetch market data');
      }
    } catch (err) {
      console.error('Error fetching market stats:', err);
      setError('Error loading market data');
    } finally {
      setLoading(false);
    }
  }, [wallet, connection]);

  useEffect(() => {
    fetchStats();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [wallet, connection, fetchStats]);

  if (loading) {
    return (
      <div className="card market-stats">
        <h2>
          <BarChart3 className="icon" />
          Market Statistics
        </h2>
        <div className="loading">
          <div className="spinner"></div>
          Loading market data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card market-stats">
        <h2>
          <BarChart3 className="icon" />
          Market Statistics
        </h2>
        <div className="error">
          <p>{error}</p>
          <button onClick={fetchStats} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="card market-stats">
        <h2>
          <BarChart3 className="icon" />
          Market Statistics
        </h2>
        <div className="no-data">
          <p>No market data available</p>
        </div>
      </div>
    );
  }

  const utilizationPercentage = stats.maxSupply > 0 
    ? ((stats.totalBought + stats.totalSold) / stats.maxSupply) * 100 
    : 0;

  return (
    <div className="card market-stats">
      <h2>
        <BarChart3 className="icon" />
        Market Statistics
      </h2>
      
      <div className="stats-grid">
        <div className="stat-item">
          <DollarSign className="stat-icon" />
          <div className="stat-value">{formatUSDC(stats.totalUSDCLeft)}</div>
          <div className="stat-label">USDC Available</div>
        </div>
        
        <div className="stat-item">
          <Wallet className="stat-icon" />
          <div className="stat-value">{formatSOL(stats.totalSOLInProgram)}</div>
          <div className="stat-label">SOL in Program</div>
        </div>
        
        <div className="stat-item">
          <TrendingUp className="stat-icon" />
          <div className="stat-value">{formatUSDC(stats.totalBought)}</div>
          <div className="stat-label">Total Bought</div>
        </div>
        
        <div className="stat-item">
          <TrendingUp className="stat-icon" />
          <div className="stat-value">{formatUSDC(stats.totalSold)}</div>
          <div className="stat-label">Total Sold</div>
        </div>
      </div>

      <div className="additional-stats">
        <div className="stat-row">
          <span className="stat-label">Max Supply:</span>
          <span className="stat-value">{formatUSDC(stats.maxSupply)} USDC</span>
        </div>
        
        <div className="stat-row">
          <span className="stat-label">Market Utilization:</span>
          <span className="stat-value">{utilizationPercentage.toFixed(2)}%</span>
        </div>
        
        <div className="stat-row">
          <span className="stat-label">Exchange Rate:</span>
          <span className="stat-value">1 USDC = 0.01 SOL</span>
        </div>
      </div>

      <button onClick={fetchStats} className="refresh-button">
        Refresh Data
      </button>
    </div>
  );
};

