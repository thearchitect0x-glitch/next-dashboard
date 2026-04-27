"use client";
import React, { useState, useEffect } from 'react';

// Color theme
const COLORS = {
  ivory: '#FFFFF0',
  black: '#292e30',
  accent: '#4ade80',
  danger: '#ef4444',
  warning: '#f59e0b'
};

interface WalletData {
  balance: number;
  spent24h: number;
  profit24h: number;
  address: string;
}

interface CarloMatrixData {
  pairs: Array<{
    name: string;
    liquidity: number;
    volume24h: number;
    priceImpact: number;
    opportunity: number;
  }>;
}

interface FlashLoanData {
  pairs: Array<{
    name: string;
    spread: number;
    profit: number;
    gas: number;
    net: number;
  }>;
}

const CommandCenter = () => {
  const [logs, setLogs] = useState<{msg: string, time: string, type: string}[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [walletData, setWalletData] = useState<WalletData>({
    balance: 0,
    spent24h: 0,
    profit24h: 0,
    address: ''
  });
  const [carloMatrix, setCarloMatrix] = useState<CarloMatrixData>({
    pairs: []
  });
  const [flashLoanMatrix, setFlashLoanMatrix] = useState<FlashLoanData>({
    pairs: []
  });

  // Fetch wallet data
  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const response = await fetch('/api/pump-sniper-v3?history=true');
        const data = await response.json();
        if (data.balance !== undefined) {
          setWalletData(prev => ({
            ...prev,
            balance: data.balance,
            address: data.signer || prev.address
          }));
        }
      } catch (error) {
        console.error('Failed to fetch wallet data:', error);
      }
    };

    fetchWalletData();
    const interval = setInterval(fetchWalletData, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Generate Carlo Matrix data (Liquidity/Volume heatmap)
  useEffect(() => {
    const generateCarloMatrix = () => {
      const pairs = [
        { name: 'SOL/USDC', liquidity: 2847, volume24h: 18940, priceImpact: 0.12, opportunity: 87 },
        { name: 'RAY/SOL', liquidity: 1523, volume24h: 9234, priceImpact: 0.28, opportunity: 64 },
        { name: 'JUP/SOL', liquidity: 3912, volume24h: 21456, priceImpact: 0.08, opportunity: 92 },
        { name: 'BONK/SOL', liquidity: 892, volume24h: 4521, priceImpact: 0.45, opportunity: 41 },
        { name: 'ORCA/SOL', liquidity: 1834, volume24h: 11234, priceImpact: 0.19, opportunity: 73 },
      ];
      setCarloMatrix({ pairs });
    };

    generateCarloMatrix();
    const interval = setInterval(generateCarloMatrix, 3000);
    return () => clearInterval(interval);
  }, []);

  // Generate Flash Loan Arb Matrix
  useEffect(() => {
    const generateFlashLoanMatrix = () => {
      const pairs = [
        { name: 'RAY: Raydium↔Orca', spread: 0.0024, profit: 0.045, gas: 0.008, net: 0.037 },
        { name: 'JUP: Jupiter↔Raydium', spread: 0.0018, profit: 0.032, gas: 0.007, net: 0.025 },
        { name: 'SOL: Pump↔Raydium', spread: 0.0031, profit: 0.058, gas: 0.009, net: 0.049 },
        { name: 'BONK: Raydium↔Meteora', spread: 0.0015, profit: 0.021, gas: 0.006, net: 0.015 },
      ];
      setFlashLoanMatrix({ pairs });
    };

    generateFlashLoanMatrix();
    const interval = setInterval(generateFlashLoanMatrix, 2500);
    return () => clearInterval(interval);
  }, []);

  // Real-time scanning logs
  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        const dexes = ['Raydium AMM', 'Raydium CLMM', 'Pump.fun', 'Orca', 'Jupiter'];
        const dex = dexes[Math.floor(Math.random() * dexes.length)];
        const actions = ['Scanning pool', 'Analyzing spread', 'Calculating arb', 'Checking liquidity'];
        const action = actions[Math.floor(Math.random() * actions.length)];
        
        const newLog = {
          msg: `[${dex}] ${action} ${Math.random().toString(36).substring(7)}...`,
          time: new Date().toLocaleTimeString(),
          type: Math.random() > 0.8 ? 'success' : 'info'
        };
        setLogs(prev => [newLog, ...prev].slice(0, 50));
        
        // Simulate spending and profit updates
        if (Math.random() > 0.95) {
          const spent = Math.random() * 0.02;
          const profit = Math.random() * 0.05;
          setWalletData(prev => ({
            ...prev,
            spent24h: prev.spent24h + spent,
            profit24h: prev.profit24h + profit,
            balance: prev.balance - spent + profit
          }));
        }
      }, 800);
      return () => clearInterval(interval);
    }
  }, [isScanning]);

  const getHeatmapColor = (value: number, max: number) => {
    const intensity = value / max;
    if (intensity > 0.8) return '#4ade80'; // Green
    if (intensity > 0.6) return '#f59e0b'; // Orange
    if (intensity > 0.4) return '#f59e0b80'; // Light orange
    return '#6b7280'; // Gray
  };

  return (
    <div 
      className="border p-6 rounded-lg shadow-2xl"
      style={{ 
        backgroundColor: COLORS.black,
        borderColor: COLORS.ivory + '40',
        color: COLORS.ivory
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 
          className="text-2xl font-bold tracking-tight"
          style={{ color: COLORS.ivory }}
        >
          COMMAND CENTER
        </h2>
        <button
          onClick={() => setIsScanning(!isScanning)}
          className="px-8 py-3 font-mono text-sm font-bold transition-all rounded"
          style={{
            backgroundColor: isScanning ? COLORS.accent : 'transparent',
            color: isScanning ? COLORS.black : COLORS.ivory,
            border: `2px solid ${isScanning ? COLORS.accent : COLORS.ivory + '60'}`
          }}
        >
          {isScanning ? '🛑 HALT' : '🚀 GO LIVE'}
        </button>
      </div>

      {/* Wallet Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div 
          className="p-4 rounded border"
          style={{ 
            backgroundColor: COLORS.black + 'cc',
            borderColor: COLORS.ivory + '30'
          }}
        >
          <div className="text-xs uppercase mb-2" style={{ color: COLORS.ivory + '80' }}>
            Wallet Balance
          </div>
          <div className="text-2xl font-bold font-mono" style={{ color: COLORS.accent }}>
            {walletData.balance.toFixed(4)} SOL
          </div>
          <div className="text-xs mt-1" style={{ color: COLORS.ivory + '60' }}>
            {walletData.address.substring(0, 8)}...
          </div>
        </div>

        <div 
          className="p-4 rounded border"
          style={{ 
            backgroundColor: COLORS.black + 'cc',
            borderColor: COLORS.ivory + '30'
          }}
        >
          <div className="text-xs uppercase mb-2" style={{ color: COLORS.ivory + '80' }}>
            Spent (24h)
          </div>
          <div className="text-2xl font-bold font-mono" style={{ color: COLORS.danger }}>
            -{walletData.spent24h.toFixed(4)} SOL
          </div>
        </div>

        <div 
          className="p-4 rounded border"
          style={{ 
            backgroundColor: COLORS.black + 'cc',
            borderColor: COLORS.ivory + '30'
          }}
        >
          <div className="text-xs uppercase mb-2" style={{ color: COLORS.ivory + '80' }}>
            Profit (24h)
          </div>
          <div className="text-2xl font-bold font-mono" style={{ color: COLORS.accent }}>
            +{walletData.profit24h.toFixed(4)} SOL
          </div>
        </div>

        <div 
          className="p-4 rounded border"
          style={{ 
            backgroundColor: COLORS.black + 'cc',
            borderColor: COLORS.ivory + '30'
          }}
        >
          <div className="text-xs uppercase mb-2" style={{ color: COLORS.ivory + '80' }}>
            Net PNL (24h)
          </div>
          <div 
            className="text-2xl font-bold font-mono" 
            style={{ 
              color: (walletData.profit24h - walletData.spent24h) >= 0 ? COLORS.accent : COLORS.danger 
            }}
          >
            {(walletData.profit24h - walletData.spent24h) >= 0 ? '+' : ''}
            {(walletData.profit24h - walletData.spent24h).toFixed(4)} SOL
          </div>
        </div>
      </div>

      {/* Carlo Matrix Heatmap */}
      <div 
        className="mb-6 p-4 rounded border"
        style={{ 
          backgroundColor: COLORS.black + 'aa',
          borderColor: COLORS.ivory + '30'
        }}
      >
        <h3 className="text-sm font-bold mb-3 uppercase" style={{ color: COLORS.ivory }}>
          📊 Carlo Matrix - Liquidity/Volume Heatmap
        </h3>
        <div className="space-y-2">
          {carloMatrix.pairs.map((pair, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-24 text-xs font-mono" style={{ color: COLORS.ivory }}>
                {pair.name}
              </div>
              <div className="flex-1 flex gap-2">
                <div 
                  className="flex-1 h-8 rounded flex items-center justify-center text-xs font-bold"
                  style={{ 
                    backgroundColor: getHeatmapColor(pair.liquidity, 4000),
                    color: COLORS.black
                  }}
                >
                  ${pair.liquidity}K LIQ
                </div>
                <div 
                  className="flex-1 h-8 rounded flex items-center justify-center text-xs font-bold"
                  style={{ 
                    backgroundColor: getHeatmapColor(pair.volume24h, 25000),
                    color: COLORS.black
                  }}
                >
                  ${pair.volume24h}K VOL
                </div>
                <div 
                  className="w-20 h-8 rounded flex items-center justify-center text-xs font-bold"
                  style={{ 
                    backgroundColor: getHeatmapColor(100 - pair.opportunity, 100),
                    color: COLORS.black
                  }}
                >
                  {pair.opportunity}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Flash Loan Arb Matrix */}
      <div 
        className="mb-6 p-4 rounded border"
        style={{ 
          backgroundColor: COLORS.black + 'aa',
          borderColor: COLORS.ivory + '30'
        }}
      >
        <h3 className="text-sm font-bold mb-3 uppercase" style={{ color: COLORS.ivory }}>
          ⚡ Flash Loan Arb Matrix
        </h3>
        <div className="space-y-2">
          <div className="grid grid-cols-5 gap-2 text-xs font-bold mb-2" style={{ color: COLORS.ivory + '80' }}>
            <div>Pair</div>
            <div className="text-center">Spread</div>
            <div className="text-center">Gross</div>
            <div className="text-center">Gas</div>
            <div className="text-center">Net</div>
          </div>
          {flashLoanMatrix.pairs.map((pair, idx) => (
            <div key={idx} className="grid grid-cols-5 gap-2 text-xs font-mono">
              <div style={{ color: COLORS.ivory }}>{pair.name}</div>
              <div className="text-center" style={{ color: COLORS.warning }}>
                {(pair.spread * 100).toFixed(2)}%
              </div>
              <div className="text-center" style={{ color: COLORS.accent }}>
                {pair.profit.toFixed(3)}
              </div>
              <div className="text-center" style={{ color: COLORS.danger }}>
                {pair.gas.toFixed(3)}
              </div>
              <div 
                className="text-center font-bold"
                style={{ color: pair.net > 0.03 ? COLORS.accent : COLORS.warning }}
              >
                {pair.net.toFixed(3)} SOL
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Logs */}
      <div 
        className="p-4 rounded border h-48 overflow-y-auto font-mono text-xs"
        style={{ 
          backgroundColor: COLORS.black + 'dd',
          borderColor: COLORS.ivory + '20',
          color: COLORS.ivory + 'aa'
        }}
      >
        <div className="text-xs font-bold mb-2 uppercase" style={{ color: COLORS.ivory }}>
          Live Execution Log
        </div>
        {logs.map((log, i) => (
          <div key={i} className="mb-1 flex">
            <span style={{ color: COLORS.ivory + '40' }} className="mr-2">
              [{log.time}]
            </span>
            <span 
              style={{ 
                color: log.type === 'success' ? COLORS.accent : COLORS.ivory + 'cc' 
              }}
            >
              {log.msg}
            </span>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="italic" style={{ color: COLORS.ivory + '40' }}>
            Awaiting initialization...
          </div>
        )}
      </div>
    </div>
  );
};

export default CommandCenter;
