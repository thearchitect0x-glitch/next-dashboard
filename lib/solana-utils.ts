// lib/solana-utils.ts - Solana connection and transaction utilities

import { Connection, PublicKey, Transaction, Keypair, sendAndConfirmTransaction } from '@solana/web3.js';

export class SolanaClient {
  private connection: Connection;
  private wallet: PublicKey;

  constructor(rpcUrl: string, walletAddress: string) {
    this.connection = new Connection(rpcUrl, 'confirmed');
    this.wallet = new PublicKey(walletAddress);
  }

  async getBalance(): Promise<number> {
    const balance = await this.connection.getBalance(this.wallet);
    return balance / 1e9; // Convert lamports to SOL
  }

  async getRecentBlockhash() {
    const { blockhash } = await this.connection.getLatestBlockhash();
    return blockhash;
  }

  async sendTransaction(transaction: Transaction, signers: Keypair[]): Promise<string> {
    // In production, you'd sign this with the actual wallet
    // For now, this is a simulation
    try {
      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        signers
      );
      return signature;
    } catch (error: any) {
      throw new Error(`Transaction failed: ${error.message}`);
    }
  }

  async getTokenBalance(tokenAccount: string): Promise<number> {
    try {
      const pubkey = new PublicKey(tokenAccount);
      const balance = await this.connection.getTokenAccountBalance(pubkey);
      return Number(balance.value.amount) / Math.pow(10, balance.value.decimals);
    } catch (error) {
      return 0;
    }
  }

  getConnection(): Connection {
    return this.connection;
  }

  getWallet(): PublicKey {
    return this.wallet;
  }
}
