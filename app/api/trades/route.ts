import { NextResponse } from 'next/server';

const mockTrades = [
  { id: '1', timestamp: Date.now() - 5000, type: 'BUY', token: 'RAY', amount: 12.5, price: 2.34, profit: 0.156, dex: 'Raydium' },
  { id: '2', timestamp: Date.now() - 15000, type: 'SELL', token: 'JUP', amount: 8.2, price: 1.89, profit: 0.089, dex: 'Jupiter' },
  { id: '3', timestamp: Date.now() - 25000, type: 'BUY', token: 'BONK', amount: 1500, price: 0.0012, profit: 0.045, dex: 'Orca' },
];

export async function GET() {
  return NextResponse.json(mockTrades);
}
