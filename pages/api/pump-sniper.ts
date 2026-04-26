// raydium-scanner.ts - Scans Raydium AMM & CLMM pools for profitable opportunities

import { Connection, PublicKey } from '@solana/web3.js';
import Decimal from 'decimal.js';

// Raydium Program IDs
const RAYDIUM_AMM_PROGRAM_ID = new PublicKey('675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8');
const RAYDIUM_CLMM_PROGRAM_ID = new PublicKey('CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK');

// Configuration
const MIN_LIQUIDITY_USD = parseFloat(process.env.RAYDIUM_MIN_LIQUIDITY || '1000');
const MAX_PRICE_IMPACT = parseFloat(process.env.RAYDIUM_MAX_PRICE_IMPACT || '5');
const MIN_PROFIT_THRESHOLD = parseFloat(process.env.MIN_PROFIT_THRESHOLD || '0.005');

export interface RaydiumOpportunity {
  type: 'raydium_amm' | 'raydium_clmm';
  poolAddress: string;
  tokenMint: string;
  baseToken: string;
  quoteToken: string;
  liquidity: number;
  volume24h: number;
  priceImpact: number;
  expectedProfit: number;
  confidence: number;
  timestamp: number;
}

/**
 * Fetch active Raydium pools from API
 */
async function fetchRaydiumPools(): Promise<any[]> {
  try {
    // Raydium V3 API endpoint
    const response = await fetch('https://api-v3.raydium.io/pools/info/list');
    const data = await response.json();
    
    if (!data.success || !data.data) {
      console.log('[RAYDIUM] API fetch failed');
      return [];
    }

    // Filter pools by liquidity and volume
    const pools = data.data.filter((pool: any) => {
      const liquidity = parseFloat(pool.tvl || '0');
      const volume = parseFloat(pool.volume24h || '0');
      
      return liquidity >= MIN_LIQUIDITY_USD && volume > 0;
    });

    console.log(`[RAYDIUM] Found ${pools.length} liquid pools`);
    return pools;
  } catch (error) {
    console.error('[RAYDIUM] Error fetching pools:', error);
    return [];
  }
}

/**
 * Calculate price impact for a trade
 */
function calculatePriceImpact(
  tradeAmount: number,
  poolLiquidity: number
): number {
  // Simplified constant product formula: x * y = k
  // Price impact = (tradeAmount / poolLiquidity) * 100
  const impact = (tradeAmount / poolLiquidity) * 100;
  return Math.min(impact, 100); // Cap at 100%
}

/**
 * Estimate profit for a Raydium trade
 */
function estimateProfit(
  pool: any,
  tradeSize: number
): { profit: number; priceImpact: number; confidence: number } {
  const liquidity = parseFloat(pool.tvl || '0');
  const volume24h = parseFloat(pool.volume24h || '0');
  
  // Calculate price impact
  const priceImpact = calculatePriceImpact(tradeSize, liquidity);
  
  // Skip if price impact too high
  if (priceImpact > MAX_PRICE_IMPACT) {
    return { profit: 0, priceImpact, confidence: 0 };
  }

  // Estimate profit based on volume/liquidity ratio
  // High volume/liquidity ratio = more trading activity = more opportunities
  const volumeRatio = volume24h / liquidity;
  
  // Profit estimate: higher volume ratio = higher potential profit
  // This is a simplified model - real profit depends on market conditions
  const baseProfitRate = 0.002; // 0.2% base profit rate
  const profitMultiplier = Math.min(volumeRatio * 10, 5); // Cap at 5x
  const estimatedProfit = tradeSize * baseProfitRate * profitMultiplier;
  
  // Confidence based on volume and liquidity
  const confidence = Math.min(volumeRatio * 100, 95) / 100;
  
  return { 
    profit: estimatedProfit, 
    priceImpact, 
    confidence 
  };
}

/**
 * Scan Raydium pools for profitable opportunities
 */
export async function scanRaydiumPools(
  connection: Connection,
  tradeSize: number = 0.08 // Default 0.08 SOL
): Promise<RaydiumOpportunity[]> {
  console.log('[RAYDIUM] Starting pool scan...');
  
  const pools = await fetchRaydiumPools();
  const opportunities: RaydiumOpportunity[] = [];

  for (const pool of pools) {
    try {
      // Estimate profit for this pool
      const { profit, priceImpact, confidence } = estimateProfit(pool, tradeSize);
      
      // Skip if profit below threshold
      if (profit < MIN_PROFIT_THRESHOLD) {
        continue;
      }

      // Skip if confidence too low
      if (confidence < 0.5) {
        continue;
      }

      const opportunity: RaydiumOpportunity = {
        type: pool.type === 'concentrated' ? 'raydium_clmm' : 'raydium_amm',
        poolAddress: pool.id,
        tokenMint: pool.mintA?.address || '',
        baseToken: pool.mintA?.symbol || 'UNKNOWN',
        quoteToken: pool.mintB?.symbol || 'UNKNOWN',
        liquidity: parseFloat(pool.tvl || '0'),
        volume24h: parseFloat(pool.volume24h || '0'),
        priceImpact,
        expectedProfit: profit,
        confidence,
        timestamp: Date.now()
      };

      opportunities.push(opportunity);
      
      console.log(`[RAYDIUM] Found opportunity: ${opportunity.baseToken}/${opportunity.quoteToken}`);
      console.log(`  Expected profit: ${profit.toFixed(4)} SOL (${(confidence * 100).toFixed(1)}% confidence)`);
      console.log(`  Price impact: ${priceImpact.toFixed(2)}%`);
    } catch (error) {
      // Skip pools with errors
      continue;
    }
  }

  // Sort by expected profit (highest first)
  opportunities.sort((a, b) => b.expectedProfit - a.expectedProfit);

  console.log(`[RAYDIUM] Scan complete. Found ${opportunities.length} profitable opportunities`);
  
  return opportunities;
}

/**
 * Get the best Raydium opportunity
 */
export async function getBestRaydiumOpportunity(
  connection: Connection,
  tradeSize: number = 0.08
): Promise<RaydiumOpportunity | null> {
  const opportunities = await scanRaydiumPools(connection, tradeSize);
  
  if (opportunities.length === 0) {
    console.log('[RAYDIUM] No opportunities found');
    return null;
  }

  const best = opportunities[0];
  console.log(`[RAYDIUM] Best opportunity: ${best.baseToken}/${best.quoteToken}`);
  console.log(`  Expected profit: ${best.expectedProfit.toFixed(4)} SOL`);
  console.log(`  Confidence: ${(best.confidence * 100).toFixed(1)}%`);
  
  return best;
}

/**
 * Check if Raydium scanning is enabled
 */
export function isRaydiumEnabled(): boolean {
  return process.env.RAYDIUM_ENABLED === 'true' || process.env.SCAN_BOTH_DEXES === 'true';
}
