"use client";
import React, { useState, useEffect } from 'react';

const COLORS = { ivory: '#FFFFF0', black: '#292e30', accent: '#4ade80', danger: '#ef4444', warning: '#f59e0b' };

export default function CommandCenter() {
  const [walletData, setWalletData] = useState({ balance: 0, spent24h: 0, profit24h: 0 });
  const [carloMatrix] = useState([
    { name: 'SOL/USDC', liquidity: 850000, volume24h: 2400000, opportunity: 92 },
    { name: 'RAY/SOL', liquidity: 620000, volume24h: 1800000, opportunity: 78 },
    { name: 'JUP/SOL', liquidity: 450000, volume24h: 1200000, opportunity: 65 },
    { name: 'BONK/SOL', liquidity: 320000, volume24h: 900000, opportunity: 54 },
    { name: 'ORCA/SOL', liquidity: 280000, volume24h: 750000, opportunity: 45 }
  ]);
  const [flashLoans] = useState([
    { route: 'RAY', spread: 0.8, grossProfit: 0.156, gasCost: 0.003, netProfit: 0.153 },
    { route: 'JUP', spread: 0.6, grossProfit: 0.118, gasCost: 0.003, netProfit: 0.115 },
    { route: 'SOL', spread: 0.5, grossProfit: 0.095, gasCost: 0.002, netProfit: 0.093 },
    { route: 'BONK', spread: 0.4, grossProfit: 0.072, gasCost: 0.003, netProfit: 0.069 }
  ]);
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await fetch('/api/pump-sniper-v3?history=true');
        const data = await res.json();
        if (data.success) setWalletData(prev => ({ ...prev, balance: data.balance || 0 }));
      } catch (e) { console.error(e); }
    };
    fetchBalance();
    const interval = setInterval(fetchBalance, 5000);
    return () => clearInterval(interval);
  }, []);
  const getOpportunityColor = (opp) => opp >= 80 ? COLORS.accent : opp >= 60 ? COLORS.warning : COLORS.ivory + '40';
  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '32px', color: COLORS.ivory }}>COMMAND CENTER</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Wallet Balance', value: `${walletData.balance.toFixed(4)} SOL` },
          { label: 'Spent 24h', value: `${walletData.spent24h.toFixed(4)} SOL` },
          { label: 'Profit 24h', value: `+${walletData.profit24h.toFixed(4)} SOL`, color: COLORS.accent },
          { label: 'Net PNL', value: `+${(walletData.profit24h - walletData.spent24h).toFixed(4)} SOL` }
        ].map((stat, i) => (
          <div key={i} style={{ backgroundColor: COLORS.black, padding: '20px', borderRadius: '8px', border: `1px solid ${COLORS.ivory}20` }}>
            <div style={{ fontSize: '12px', color: COLORS.ivory + '80', marginBottom: '8px' }}>{stat.label}</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: stat.color || COLORS.ivory }}>{stat.value}</div>
          </div>
        ))}
      </div>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: COLORS.ivory }}>CARLO MATRIX</h2>
        <div style={{ backgroundColor: COLORS.black, padding: '20px', borderRadius: '8px', border: `1px solid ${COLORS.ivory}20` }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
            {carloMatrix.map((pair, i) => (
              <div key={i} style={{ padding: '16px', borderRadius: '6px', backgroundColor: getOpportunityColor(pair.opportunity) + '20', border: `2px solid ${getOpportunityColor(pair.opportunity)}` }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: COLORS.ivory, marginBottom: '8px' }}>{pair.name}</div>
                <div style={{ fontSize: '11px', color: COLORS.ivory + 'cc' }}>Liq: ${(pair.liquidity / 1000).toFixed(0)}K</div>
                <div style={{ fontSize: '11px', color: COLORS.ivory + 'cc' }}>Vol: ${(pair.volume24h / 1000).toFixed(0)}K</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: getOpportunityColor(pair.opportunity), marginTop: '8px' }}>{pair.opportunity}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: COLORS.ivory }}>FLASH LOAN ARB MATRIX</h2>
        <div style={{ backgroundColor: COLORS.black, padding: '20px', borderRadius: '8px', border: `1px solid ${COLORS.ivory}20` }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr>{['Route', 'Spread %', 'Gross Profit', 'Gas Cost', 'Net Profit'].map((h, i) => <th key={i} style={{ textAlign: 'left', padding: '12px', color: COLORS.ivory + 'cc', fontSize: '12px', borderBottom: `1px solid ${COLORS.ivory}20` }}>{h}</th>)}</tr></thead>
            <tbody>{flashLoans.map((loan, i) => (
              <tr key={i}>
                <td style={{ padding: '12px', color: COLORS.ivory, fontWeight: 'bold' }}>{loan.route}</td>
                <td style={{ padding: '12px', color: COLORS.warning }}>{loan.spread.toFixed(1)}%</td>
                <td style={{ padding: '12px', color: COLORS.accent }}>{loan.grossProfit.toFixed(3)} SOL</td>
                <td style={{ padding: '12px', color: COLORS.danger }}>{loan.gasCost.toFixed(3)} SOL</td>
                <td style={{ padding: '12px', color: COLORS.accent, fontWeight: 'bold' }}>{loan.netProfit.toFixed(3)} SOL</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <button style={{ backgroundColor: COLORS.black, color: COLORS.ivory, padding: '16px 48px', fontSize: '20px', fontWeight: 'bold', border: `2px solid ${COLORS.ivory}`, borderRadius: '8px', cursor: 'pointer' }}>🚀 GO LIVE</button>
      </div>
    </div>
  );
}
