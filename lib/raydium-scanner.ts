// raydium-scanner.ts - Scans Raydium AMM & CLMM pools for profitable opportunities 
import { Connection, PublicKey } from '@solana/web3.js'; 
import Decimal from 'decimal.js'; 

// Configuration 
const MIN_LIQUIDITY_USD = parseFloat(process.env.RAYDIUM_MIN_LIQUIDITY || '200'); 
const MAX_PRICE_IMPACT = parseFloat(process.env.RAYDIUM_MAX_PRICE_IMPACT || '15'); 
const MIN_PROFIT_THRESHOLD = parseFloat(process.env.MIN_PROFIT_THRESHOLD || '0.001'); 

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

async function fetchRaydiumPools(): Promise<any[]> { 
  try { 
      // Aggressive Scanning: Fetch latest active pools from Raydium V3 API 
      const response = await fetch('https://api-v3.raydium.io/pools/info/list?limit=1000&sort=volume24h&order=desc'); 
      const data = await response.json(); 
      if (!data.success || !data.data) { 
          console.log('[RAYDIUM] API fetch failed or returned empty data'); 
          return []; 
      } 
      const pools = data.data.filter((pool: any) => { 
                                           const liquidity = parseFloat(pool.tvl || '0'); 
                                           const volume = parseFloat(pool.volume24h || '0'); 
                                           // Scan for liquid pools with active volume 
                                           return liquidity >= MIN_LIQUIDITY_USD && volume > 10; 
      }); 
      console.log(`[RAYDIUM] Successfully scanned ${pools.length} active liquidity pools`); 
      return pools; 
  } catch (error) { 
      console.error('[RAYDIUM] Error fetching pools:', error); 
      return []; 
  } 
} 

function calculatePriceImpact(tradeAmount: number, poolLiquidity: number): number { 
  const impact = (tradeAmount / poolLiquidity) * 100; 
  return Math.min(impact, 100); 
} 

function estimateProfit(pool: any, tradeSize: number): { profit: number; priceImpact: number; confidence: number } { 
  const liquidity = parseFloat(pool.tvl || '0'); 
  const volume24h = parseFloat(pool.volume24h || '0'); 
  const priceImpact = calculatePriceImpact(tradeSize, liquidity); 
  if (priceImpact > MAX_PRICE_IMPACT) return { profit: 0, priceImpact, confidence: 0 }; 
  const volumeRatio = volume24h / liquidity; 
  const baseProfitRate = 0.005; // 0.5% target for Raydium sniping 
  const estimatedProfit = tradeSize * baseProfitRate * Math.min(volumeRatio, 2); 
  const confidence = Math.min(volumeRatio * 10, 0.98); 
  return { profit: estimatedProfit, priceImpact, confidence }; 
} 

export async function scanRaydiumPools(connection: Connection, tradeSize: number = 0.15): Promise<RaydiumOpportunity[]> { 
  console.log('[RAYDIUM] Starting deep pool scan...'); 
  const pools = await fetchRaydiumPools(); 
  const opportunities: RaydiumOpportunity[] = []; 
  for (const pool of pools) { 
      const { profit, priceImpact, confidence } = estimateProfit(pool, tradeSize); 
      if (profit < MIN_PROFIT_THRESHOLD || confidence < 0.4) continue; 
      opportunities.push({ 
                               type: pool.programId?.includes('CAMM') ? 'raydium_clmm' : 'raydium_amm', 
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
      }); 
  } 
  return opportunities.sort((a, b) => b.expectedProfit - a.expectedProfit); 
} 

export async function getBestRaydiumOpportunity(connection: Connection, tradeSize: number = 0.15): Promise<RaydiumOpportunity | null> { 
  const opportunities = await scanRaydiumPools(connection, tradeSize); 
  return opportunities.length > 0 ? opportunities[0] : null; 
} 

export function isRaydiumEnabled(): boolean { 
  return process.env.RAYDIUM_ENABLED === 'true' || process.env.SCAN_BOTH_DEXES === 'true'; 
}
