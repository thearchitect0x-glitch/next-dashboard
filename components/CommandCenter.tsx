"use client";
import React, { useState, useEffect, useRef } from 'react';

const COLORS = {
  ivory: '#FFFFF0',
  black: '#0a0a0a',
  accent: '#00ff88',
  danger: '#ff3366',
  warning: '#ffaa00',
  grid: '#1a1a1a'
};

interface Trade {
  id: string;
  timestamp: number;
  type: 'BUY' | 'SELL';
  token: string;
  amount: number;
  price: number;
  profit: number;
  dex: string;
}

interface Pool {
  address: string;
  token0: string;
  token1: string;
  liquidity: number;
  volume24h: number;
  fee: number;
  dex: string;
}

interface ArbOpportunity {
  id: string;
  route: string[];
  spread: number;
  grossProfit: number;
  gasCost: number;
  netProfit: number;
  timestamp: number;
}

interface LatencyPoint {
  timestamp: number;
  rpcLatency: number;
  execLatency: number;
}

interface DetectedBot {
  id: string;
  address: string;
  lastSeen: number;
  txCount: number;
  strategy: string;
}

export default function CommandCenter() {
  const [isActive, setIsActive] = useState(false);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [pools, setPools] = useState<Pool[]>([]);
  const [arbOpps, setArbOpps] = useState<ArbOpportunity[]>([]);
  const [latencyData, setLatencyData] = useState<LatencyPoint[]>([]);
  const [detectedBots, setDetectedBots] = useState<DetectedBot[]>([]);
  const [currentBundle, setCurrentBundle] = useState<string[]>([]);
  const [stats, setStats] = useState({
    balance: 0,
    totalProfit: 0,
    winRate: 0,
    avgLatency: 0
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Fetch real-time data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tradesRes, poolsRes, arbRes, latencyRes, botsRes, bundleRes, statsRes] = await Promise.all([
          fetch('/api/trades'),
          fetch('/api/pools'),
          fetch('/api/arbitrage'),
          fetch('/api/latency'),
          fetch('/api/bots'),
          fetch('/api/bundles'),
          fetch('/api/stats')
        ]);

        if (tradesRes.ok) setTrades(await tradesRes.json());
        if (poolsRes.ok) setPools(await poolsRes.json());
        if (arbRes.ok) setArbOpps(await arbRes.json());
        if (latencyRes.ok) setLatencyData(await latencyRes.json());
        if (botsRes.ok) setDetectedBots(await botsRes.json());
        if (bundleRes.ok) setCurrentBundle(await bundleRes.json());
        if (statsRes.ok) setStats(await statsRes.json());
      } catch (e) {
        console.error('Data fetch error:', e);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  // Render latency scatter plot
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || latencyData.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = COLORS.black;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Plot points
    latencyData.forEach((point, idx) => {
      const x = (idx / latencyData.length) * canvas.width;
      const y = canvas.height - (point.rpcLatency / 100) * canvas.height;
      
      ctx.fillStyle = point.rpcLatency < 20 ? COLORS.accent : COLORS.warning;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [latencyData]);

  const toggleBot = async () => {
    try {
      const res = await fetch('/api/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: isActive ? 'stop' : 'start' })
      });
      if (res.ok) setIsActive(!isActive);
    } catch (e) {
      console.error('Control error:', e);
    }
  };

  return (
    <div style={{ 
      background: `linear-gradient(180deg, ${COLORS.black} 0%, #050505 100%)`,
      minHeight: '100vh',
      color: COLORS.ivory,
      padding: '24px',
      fontFamily: 'monospace'
    }}>
      {/* Header with Logo */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', background: COLORS.ivory, borderRadius: '50%', opacity: 0.9 }} />
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>BLACKSTAR COMMAND CENTER</h1>
            <div style={{ fontSize: '12px', color: COLORS.accent }}>MULTI-DEX ARBITRAGE ENGINE</div>
          </div>
        </div>
        
        {/* Launch/Halt Button */}
        <button
          onClick={toggleBot}
          style={{
            background: isActive ? COLORS.danger : COLORS.black,
            color: COLORS.ivory,
            border: `3px solid ${isActive ? COLORS.danger : COLORS.ivory}`,
            padding: '16px 48px',
            fontSize: '18px',
            fontWeight: 'bold',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: isActive ? `0 0 20px ${COLORS.danger}` : 'none',
            transition: 'all 0.3s'
          }}
        >
          {isActive ? '⬛ HALT' : '▶ LAUNCH'}
        </button>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'WALLET BALANCE', value: `${stats.balance.toFixed(4)} SOL`, color: COLORS.accent },
          { label: 'TOTAL PROFIT 24H', value: `+${stats.totalProfit.toFixed(4)} SOL`, color: COLORS.accent },
          { label: 'WIN RATE', value: `${stats.winRate.toFixed(1)}%`, color: COLORS.ivory },
          { label: 'AVG LATENCY', value: `${stats.avgLatency.toFixed(1)}ms`, color: COLORS.warning }
        ].map((stat, i) => (
          <div key={i} style={{ 
            background: COLORS.grid,
            padding: '20px',
            borderRadius: '8px',
            border: `1px solid ${COLORS.ivory}20`
          }}>
            <div style={{ fontSize: '11px', color: COLORS.ivory + '80', marginBottom: '8px' }}>{stat.label}</div>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Liquidity Heatmap */}
        <div style={{ background: COLORS.grid, padding: '20px', borderRadius: '8px', border: `1px solid ${COLORS.ivory}20` }}>
          <h3 style={{ fontSize: '14px', marginBottom: '16px', color: COLORS.ivory }}>LIQUIDITY HEATMAP</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
            {pools.slice(0, 10).map((pool, i) => {
              const intensity = Math.min(pool.liquidity / 1000000, 1);
              return (
                <div key={i} style={{
                  padding: '12px',
                  borderRadius: '6px',
                  background: `rgba(0, 255, 136, ${intensity * 0.3})`,
                  border: `2px solid rgba(0, 255, 136, ${intensity})`,
                  fontSize: '11px'
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{pool.token0}/{pool.token1}</div>
                  <div>${(pool.liquidity / 1000).toFixed(0)}K</div>
                  <div style={{ color: COLORS.accent }}>{pool.dex}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Flash Arb Opportunities */}
        <div style={{ background: COLORS.grid, padding: '20px', borderRadius: '8px', border: `1px solid ${COLORS.ivory}20` }}>
          <h3 style={{ fontSize: '14px', marginBottom: '16px', color: COLORS.ivory }}>FLASH ARB OPPORTUNITIES</h3>
          <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
            {arbOpps.map((opp) => (
              <div key={opp.id} style={{
                padding: '12px',
                marginBottom: '8px',
                background: COLORS.black,
                borderRadius: '6px',
                border: `1px solid ${opp.netProfit > 0.1 ? COLORS.accent : COLORS.warning}`,
                animation: 'pulse 2s infinite'
              }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
                  {opp.route.join(' → ')}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                  <span>Spread: {opp.spread.toFixed(2)}%</span>
                  <span style={{ color: COLORS.accent }}>+{opp.netProfit.toFixed(3)} SOL</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Trade Log */}
        <div style={{ background: COLORS.grid, padding: '20px', borderRadius: '8px', border: `1px solid ${COLORS.ivory}20` }}>
          <h3 style={{ fontSize: '14px', marginBottom: '16px', color: COLORS.ivory }}>TRADE EXECUTION LOG</h3>
          <div style={{ maxHeight: '200px', overflowY: 'auto', fontSize: '11px' }}>
            {trades.map((trade) => (
              <div key={trade.id} style={{
                padding: '8px',
                marginBottom: '6px',
                background: COLORS.black,
                borderLeft: `3px solid ${trade.type === 'BUY' ? COLORS.accent : COLORS.danger}`,
                borderRadius: '4px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: trade.type === 'BUY' ? COLORS.accent : COLORS.danger }}>{trade.type}</span>
                  <span>{trade.token}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: COLORS.ivory + '80' }}>
                  <span>{trade.amount.toFixed(4)}</span>
                  <span style={{ color: trade.profit > 0 ? COLORS.accent : COLORS.danger }}>
                    {trade.profit > 0 ? '+' : ''}{trade.profit.toFixed(3)} SOL
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latency Scatter Plot */}
        <div style={{ background: COLORS.grid, padding: '20px', borderRadius: '8px', border: `1px solid ${COLORS.ivory}20` }}>
          <h3 style={{ fontSize: '14px', marginBottom: '16px', color: COLORS.ivory }}>RPC LATENCY MONITOR</h3>
          <canvas ref={canvasRef} width={280} height={180} style={{ width: '100%', borderRadius: '4px' }} />
        </div>

        {/* Detected Bots */}
        <div style={{ background: COLORS.grid, padding: '20px', borderRadius: '8px', border: `1px solid ${COLORS.ivory}20` }}>
          <h3 style={{ fontSize: '14px', marginBottom: '16px', color: COLORS.ivory }}>DETECTED MEV BOTS</h3>
          <div style={{ maxHeight: '200px', overflowY: 'auto', fontSize: '11px' }}>
            {detectedBots.map((bot) => (
              <div key={bot.id} style={{
                padding: '8px',
                marginBottom: '6px',
                background: COLORS.black,
                borderRadius: '4px',
                border: `1px solid ${COLORS.danger}40`
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{bot.address.substring(0, 8)}...</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: COLORS.ivory + '80' }}>
                  <span>{bot.strategy}</span>
                  <span>{bot.txCount} txs</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bundle Builder */}
      <div style={{ background: COLORS.grid, padding: '20px', borderRadius: '8px', border: `1px solid ${COLORS.ivory}20` }}>
        <h3 style={{ fontSize: '14px', marginBottom: '16px', color: COLORS.ivory }}>BUNDLE CONSTRUCTION (REAL-TIME)</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {currentBundle.map((tx, i) => (
            <div key={i} style={{
              padding: '12px 16px',
              background: COLORS.black,
              borderRadius: '6px',
              border: `2px solid ${COLORS.accent}`,
              fontSize: '12px',
              animation: 'slideIn 0.3s ease-out'
            }}>
              TX {i + 1}: {tx.substring(0, 12)}...
            </div>
          ))}
          {currentBundle.length === 0 && (
            <div style={{ color: COLORS.ivory + '40', fontSize: '12px' }}>No bundle being constructed</div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes slideIn {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
