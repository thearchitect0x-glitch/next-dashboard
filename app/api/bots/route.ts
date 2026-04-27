import { NextResponse } from 'next/server';

const mockBots = [
  { id: '1', address: '7xKXt...9zB3C', lastSeen: Date.now() - 3000, txCount: 156, strategy: 'Frontrun' },
  { id: '2', address: '5mQPe...4fT2A', lastSeen: Date.now() - 8000, txCount: 89, strategy: 'Sandwich' },
  { id: '3', address: '9kRLm...3sP7K', lastSeen: Date.now() - 12000, txCount: 234, strategy: 'Backrun' },
];

export async function GET() {
  return NextResponse.json(mockBots);
}
