// lib/jupiter-client.ts - Jupiter aggregator integration for optimal swaps

import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { TradeResult } from '../types/trading';

interface SwapParams {
    inputMint: string;
    outputMint: string;
    amount: number;
    slippageBps: number; // Basis points (100 = 1%)
}

export class JupiterClient {
    private connection: Connection;
    private wallet: PublicKey;
    private readonly JUPITER_API = 'https://quote-api.jup.ag/v6';

  constructor(connection: Connection, walletAddress: string) {
        this.connection = connection;
        this.wallet = new PublicKey(walletAddress);
  }

  async getQuote(params: SwapParams): Promise<any | null> {
        try {
                const url = `${this.JUPITER_API}/quote?inputMint=${params.inputMint}&outputMint=${params.outputMint}&amount=${params.amount}&slippageBps=${params.slippageBps}`;
                const response = await fetch(url);
                const quote = await response.json();

          if (quote.error) {
                    console.error('Jupiter quote error:', quote.error);
                    return null;
          }

          return quote;
        } catch (error: any) {
                console.error('Failed to get real Jupiter quote:', error);
                return null;
        }
  }

  async executeSwap(params: SwapParams): Promise<TradeResult> {
        const startTime = Date.now();
        const { SolanaClient } = require('./solana-utils');
        const signer = SolanaClient.getSigner();

      if (!signer) {
              return { success: false, error: 'No signer available. Check SIGNER_PRIVATE_KEY.', timestamp: startTime };
      }

      try {
              // 1. Get real quote
          const quote = await this.getQuote(params);
              if (!quote) return { success: false, error: 'Failed to get quote', timestamp: startTime };

          // 2. Get swap transaction
          const swapRes = await fetch(`${this.JUPITER_API}/swap`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                                quoteResponse: quote,
                                userPublicKey: this.wallet.toString(),
                                wrapAndUnwrapSol: true,
                                dynamicComputeUnitLimit: true,
                                prioritizationFeeLamports: 50000 // Small priority fee
                    })
          });

          const { swapTransaction } = await swapRes.json();
              if (!swapTransaction) return { success: false, error: 'Failed to get swap transaction', timestamp: startTime };

          // 3. Deserialize and sign
          const { VersionedTransaction } = require('@solana/web3.js');
              const transactionBuf = Buffer.from(swapTransaction, 'base64');
              const transaction = VersionedTransaction.deserialize(transactionBuf);

          transaction.sign([signer]);

          // 4. Execute
          const signature = await this.connection.sendRawTransaction(transaction.serialize(), {
                    skipPreflight: false,
                    preflightCommitment: 'confirmed'
          });

          // 5. Confirm
          await this.connection.confirmTransaction(signature, 'confirmed');

          return {
                    success: true,
                    signature: signature,
                    profit: (Number(quote.outAmount) - Number(quote.inAmount)) / 1e9, // Estimated
                    timestamp: startTime,
                    gasUsed: 0.00005
          };

      } catch (error: any) {
              console.error('Swap execution failed:', error);
              return {
                        success: false,
                        error: error.message,
                        timestamp: startTime
              };
      }
  }
}
