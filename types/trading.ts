// types/trading.ts - Complete trading type definitions

export interface Pool {
  id: string;
  tokenA: string;
  tokenB: string;
  reserveA: number;
  reserveB: number;
  price: number;
  liquidity: number;
  volume24h: number;
  fees24h: number;
}

export interface ArbitrageOpportunity {
  poolA: Pool;
  poolB: Pool;
  tokenIn: string;
  tokenOut: string;
  amountIn: number;
  expectedProfit: number;
  profitPercentage: number;
  route: string[];
  confidence: number;
}

export interface TradeResult {
  success: boolean;
  signature?: string;
  profit?: number;
  error?: string;
  timestamp: number;
  gasUsed?: number;
}

export interface BotConfig {
  walletPublicKey: string;
  rpcUrl: string;
  maxTradeSize: number;
  minProfitThreshold: number;
  slippageTolerance: number;
  gasPrice: number;
  enabledDexes: string[];
}

export interface BotState {
  active: boolean;
  totalTrades: number;
  successfulTrades: number;
  totalProfit: number;
  lastTradeTime: number;
  errorCount: number;
}
