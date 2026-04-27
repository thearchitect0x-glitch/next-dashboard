// lib/trading-bot.ts - Main trading bot orchestrator

import { SolanaClient } from './solana-utils';
import { RaydiumScanner } from './raydium-sdk';
import { JupiterClient } from './jupiter-client';
import { ArbitrageScanner } from './arbitrage-scanner';
import { BotConfig, BotState, TradeResult, ArbitrageOpportunity } from '../types/trading';

export class TradingBot {
  private solanaClient: SolanaClient;
  private raydiumScanner: RaydiumScanner;
  private jupiterClient: JupiterClient;
  private arbScanner: ArbitrageScanner;
  private config: BotConfig;
  private state: BotState;
  private scanInterval: NodeJS.Timeout | null = null;

  constructor(config: BotConfig) {
    this.config = config;
    
    // Initialize clients
    this.solanaClient = new SolanaClient(config.rpcUrl, config.walletPublicKey);
    this.raydiumScanner = new RaydiumScanner(this.solanaClient.getConnection());
    this.jupiterClient = new JupiterClient(this.solanaClient.getConnection(), config.walletPublicKey);
    this.arbScanner = new ArbitrageScanner(config.minProfitThreshold, config.maxTradeSize);

    // Initialize state
    this.state = {
      active: false,
      totalTrades: 0,
      successfulTrades: 0,
      totalProfit: 0,
      lastTradeTime: 0,
      errorCount: 0
    };
  }

  async start(): Promise<void> {
    if (this.state.active) {
      console.log('Bot is already running');
      return;
    }

    console.log('🚀 Starting Blackstar Trading Bot...');
    this.state.active = true;

    // Start scanning for opportunities
    this.scanInterval = setInterval(async () => {
      await this.scanAndTrade();
    }, 5000); // Scan every 5 seconds

    console.log('✅ Bot started successfully');
  }

  async stop(): Promise<void> {
    if (!this.state.active) {
      console.log('Bot is not running');
      return;
    }

    console.log('🛑 Stopping Blackstar Trading Bot...');
    this.state.active = false;

    if (this.scanInterval) {
      clearInterval(this.scanInterval);
      this.scanInterval = null;
    }

    console.log('✅ Bot stopped successfully');
  }

  private async scanAndTrade(): Promise<void> {
    if (!this.state.active) return;

    try {
      // Step 1: Scan Raydium pools
      const pools = await this.raydiumScanner.scanPools();
      console.log(`📊 Scanned ${pools.length} pools`);

      // Step 2: Find arbitrage opportunities
      const opportunity = await this.arbScanner.findBestOpportunity(pools);
      
      if (!opportunity) {
        console.log('⏸️  No profitable opportunities found');
        return;
      }

      console.log(`💰 Found opportunity: ${opportunity.expectedProfit.toFixed(4)} SOL profit (${opportunity.profitPercentage.toFixed(2)}%)`);

      // Step 3: Execute trade if profitable
      if (opportunity.expectedProfit >= this.config.minProfitThreshold) {
        await this.executeTrade(opportunity);
      }

    } catch (error: any) {
      console.error('❌ Error in scan cycle:', error.message);
      this.state.errorCount++;
    }
  }

  private async executeTrade(opportunity: ArbitrageOpportunity): Promise<void> {
    console.log(`🔄 Executing trade...`);

    try {
      // Execute swap via Jupiter
      const result: TradeResult = await this.jupiterClient.executeSwap({
        inputMint: opportunity.tokenIn,
        outputMint: opportunity.tokenOut,
        amount: opportunity.amountIn,
        slippageBps: this.config.slippageTolerance * 100
      });

      // Update state
      this.state.totalTrades++;
      this.state.lastTradeTime = Date.now();

      if (result.success && result.profit) {
        this.state.successfulTrades++;
        this.state.totalProfit += result.profit;
        
        console.log(`✅ Trade successful!`);
        console.log(`   Signature: ${result.signature}`);
        console.log(`   Profit: ${result.profit.toFixed(4)} SOL`);
        console.log(`   Gas: ${result.gasUsed} SOL`);
      } else {
        console.log(`❌ Trade failed: ${result.error}`);
        this.state.errorCount++;
      }

    } catch (error: any) {
      console.error(`❌ Trade execution error: ${error.message}`);
      this.state.errorCount++;
    }
  }

  getState(): BotState {
    return { ...this.state };
  }

  async getBalance(): Promise<number> {
    return await this.solanaClient.getBalance();
  }

  updateConfig(newConfig: Partial<BotConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Update scanner thresholds
    if (newConfig.minProfitThreshold) {
      this.arbScanner.setMinProfitThreshold(newConfig.minProfitThreshold);
    }
    if (newConfig.maxTradeSize) {
      this.arbScanner.setMaxTradeSize(newConfig.maxTradeSize);
    }
  }

  isActive(): boolean {
    return this.state.active;
  }

  getWinRate(): number {
    if (this.state.totalTrades === 0) return 0;
    return (this.state.successfulTrades / this.state.totalTrades) * 100;
  }
}

// Singleton instance
let botInstance: TradingBot | null = null;

export function getBotInstance(config?: BotConfig): TradingBot {
  if (!botInstance && config) {
    botInstance = new TradingBot(config);
  }
  
  if (!botInstance) {
    throw new Error('Bot not initialized. Provide config on first call.');
  }
  
  return botInstance;
}
