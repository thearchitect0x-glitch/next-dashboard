import { NextResponse } from 'next/server';

export async function GET() {
  const data = Array.from({ length: 50 }, (_, i) => ({
    timestamp: Date.now() - (50 - i) * 2000,
    rpcLatency: Math.random() * 40 + 5,
    execLatency: Math.random() * 60 + 10
  }));
  return NextResponse.json(data);
}
