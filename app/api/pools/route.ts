import { NextResponse } from 'next/server';

const mockPools = [
  { address: 'pool1', token0: 'SOL', token1: 'USDC', liquidity: 2400000, volume24h: 5600000, fee: 0.003, dex: 'Raydium' },
  { address: 'pool2', token0: 'RAY', token1: 'SOL', liquidity: 1800000, volume24h: 3200000, fee: 0.003, dex: 'Raydium' },
  { address: 'pool3', token0: 'JUP', token1: 'SOL', liquidity: 1200000, volume24h: 2100000, fee: 0.003, dex: 'Jupiter' },
  { address: 'pool4', token0: 'BONK', token1: 'SOL', liquidity: 900000, volume24h: 1500000, fee: 0.003, dex: 'Orca' },
  { address: 'pool5', token0: 'ORCA', token1: 'SOL', liquidity: 750000, volume24h: 1200000, fee: 0.003, dex: 'Orca' },
];

export async function GET() {
  return NextResponse.json(mockPools);
}
