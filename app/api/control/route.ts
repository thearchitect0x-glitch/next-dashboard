// app/api/control/route.ts - UPDATED to actually control the trading bot

import { NextResponse } from 'next/server';
import { getBotInstance } from '@/lib/trading-bot';
import type { BotConfig } from '@/types/trading';

export async function POST(request: Request) {
  try {
    const { action } = await request.json();
    
    // Get bot configuration from environment
    const config: BotConfig = {
      walletPublicKey: process.env.WALLET_PUBLIC_KEY || '3KrLbAZE4biKZfPggPiSAYDVsJT81dfKhioXDGqYuUQW',
      rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
      maxTradeSize: parseFloat(process.env.MAX_TRADE_SIZE || '1.0'),
      minProfitThreshold: parseFloat(process.env.MIN_PROFIT_THRESHOLD || '0.01'),
      slippageTolerance: parseFloat(process.env.SLIPPAGE_TOLERANCE || '0.01'),
      gasPrice: parseFloat(process.env.GAS_PRICE || '0.00001'),
      enabledDexes: (process.env.ENABLED_DEXES || 'raydium,jupiter').split(',')
    };

    // Get or create bot instance
    const bot = getBotInstance(config);
    
    if (action === 'start') {
      await bot.start();
      
      return NextResponse.json({ 
        success: true, 
        status: 'started',
        message: 'Trading bot started successfully',
        state: bot.getState()
      });
      
    } else if (action === 'stop') {
      await bot.stop();
      
      return NextResponse.json({ 
        success: true, 
        status: 'stopped',
        message: 'Trading bot stopped successfully',
        state: bot.getState()
      });
      
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "start" or "stop"' },
        { status: 400 }
      );
    }
    
  } catch (error: any) {
    console.error('Control API error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Return bot state if initialized
    const config: BotConfig = {
      walletPublicKey: process.env.WALLET_PUBLIC_KEY || '3KrLbAZE4biKZfPggPiSAYDVsJT81dfKhioXDGqYuUQW',
      rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
      maxTradeSize: 1.0,
      minProfitThreshold: 0.01,
      slippageTolerance: 0.01,
      gasPrice: 0.00001,
      enabledDexes: ['raydium', 'jupiter']
    };
    
    const bot = getBotInstance(config);
    const state = bot.getState();
    
    return NextResponse.json({
      active: bot.isActive(),
      ...state,
      winRate: bot.getWinRate()
    });
    
  } catch (error: any) {
    return NextResponse.json(
      { active: false, error: error.message },
      { status: 500 }
    );
  }
}
