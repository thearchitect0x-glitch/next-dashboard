import { NextResponse } from 'next/server';

const generateArb = () => ({
  id: Math.random().toString(36),
  route: ['Raydium', 'Jupiter', 'Orca'],
  spread: Math.random() * 2 + 0.5,
  grossProfit: Math.random() * 0.3,
  gasCost: 0.003,
  netProfit: Math.random() * 0.25,
  timestamp: Date.now()
});

export async function GET() {
  const opps = Array.from({ length: 5 }, generateArb);
  return NextResponse.json(opps);
}
