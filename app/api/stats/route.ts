import { NextResponse } from 'next/server';
import { Connection, PublicKey } from '@solana/web3.js';

const RPC = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
const WALLET = process.env.WALLET_PUBLIC_KEY || '3KrLbAZE4biKZfPggPiSAYDVsJT81dfKhioXDGqYuUQW';

export async function GET() {
  try {
    const connection = new Connection(RPC, 'confirmed');
    const publicKey = new PublicKey(WALLET);
    
    const balance = await connection.getBalance(publicKey);
    const balanceSOL = balance / 1e9;

    // Mock data for now - will be replaced with real DB queries
    const stats = {
      balance: balanceSOL,
      totalProfit: 2.456,
      winRate: 94.2,
      avgLatency: 12.3
    };

    return NextResponse.json(stats);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
