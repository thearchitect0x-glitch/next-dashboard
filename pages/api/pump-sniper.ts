// pages/api/pump-sniper.ts - API route for multi-DEX trading bot

import type { NextApiRequest, NextApiResponse } from 'next';
import { Connection, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { runTradingBot } from '../../lib/pump-sniper-multi-dex';
import bs58 from 'bs58';

// CORS headers for cron-job.org
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Handle OPTIONS request (CORS preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).json({});
    return;
  }

  // Set CORS headers
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  try {
    // Check authorization
    const authHeader = req.headers.authorization;
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;
    
    // If no auth header, return basic status
    if (!authHeader || authHeader !== expectedAuth) {
      // Return basic status without executing bot
      const signerKey = process.env.SIGNER_PRIVATE_KEY;
      if (!signerKey) {
        return res.status(500).json({ 
          error: 'SIGNER_PRIVATE_KEY not configured' 
        });
      }

      const signer = Keypair.fromSecretKey(bs58.decode(signerKey));
      const connection = new Connection(
        process.env.HELIUS_RPC_URL || 'https://api.mainnet-beta.solana.com',
        'confirmed'
      );
      
      const balance = await connection.getBalance(signer.publicKey);
      
      return res.status(200).json({
        status: 'active',
        signer: signer.publicKey.toString(),
        balance: balance / LAMPORTS_PER_SOL
      });
    }

    // Execute the trading bot
    console.log('[API] Authorized request - running trading bot');
    const result = await runTradingBot();
    
    return res.status(200).json(result);
    
  } catch (error: any) {
    console.error('[API] Error:', error);
    return res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
}
