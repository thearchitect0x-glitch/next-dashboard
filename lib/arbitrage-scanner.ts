// lib/arbitrage-scanner.ts - Detect arbitrage opportunities across DEXes

import { Pool, ArbitrageOpportunity } from '../types/trading';

export class ArbitrageScanner {
  private minProfitThreshold: number;
  private maxTradeSize: number;

  constructor(minProfitThreshold: number = 0.01, maxTradeSize: number = 1.0) {
    this.minProfitThreshold = minProfitThreshold;
    this.maxTradeSize = maxTradeSize;
  }

  async scanForOpportunities(pools: Pool[]): Promise<ArbitrageOpportunity[]> {
    const opportunities: ArbitrageOpportunity[] = [];

    // Look for price differences between pools with same token pairs
    for (let i = 0; i < pools.length; i++) {
      for (let j = i + 1; j < pools.length; j++) {
        const poolA = pools[i];
        const poolB = pools[j];

        // Check if pools have matching token pairs (in any order)
        if (this.isMatchingPair(poolA, poolB)) {
          const opportunity = this.calculateArbitrage(poolA, poolB);
          
          if (opportunity && opportunity.expectedProfit >= this.minProfitThreshold) {
            opportunities.push(opportunity);
          }
        }
      }
    }

    // Sort by expected profit (highest first)
    return opportunities.sort((a, b) => b.expectedProfit - a.expectedProfit);
  }

  private isMatchingPair(poolA: Pool, poolB: Pool): boolean {
    return (
      (poolA.tokenA === poolB.tokenA && poolA.tokenB === poolB.tokenB) ||
      (poolA.tokenA === poolB.tokenB && poolA.tokenB === poolB.tokenA)
    );
  }

  private calculateArbitrage(poolA: Pool, poolB: Pool): ArbitrageOpportunity | null {
    // Calculate price difference
    const priceA = poolA.price;
    const priceB = poolB.price;
    const priceDiff = Math.abs(priceA - priceB);
    const avgPrice = (priceA + priceB) / 2;
    const priceSpread = (priceDiff / avgPrice) * 100;

    // Only consider if spread is significant (> 0.5%)
    if (priceSpread < 0.5) {
      return null;
    }

    // Determine trade direction
    const [buyPool, sellPool] = priceA < priceB ? [poolA, poolB] : [poolB, poolA];

    // Calculate optimal trade size (limited by liquidity and max trade size)
    const maxSize = Math.min(
      buyPool.liquidity * 0.01, // Max 1% of pool liquidity
      this.maxTradeSize
    );

    // Calculate expected profit (simplified - doesn't account for slippage)
    const buyPrice = buyPool.price;
    const sellPrice = sellPool.price;
    const expectedProfit = maxSize * (sellPrice - buyPrice);
    const profitPercentage = (expectedProfit / (maxSize * buyPrice)) * 100;

    // Calculate confidence based on liquidity and volume
    const liquidityScore = Math.min(buyPool.liquidity, sellPool.liquidity) / 1000000;
    const volumeScore = Math.min(buyPool.volume24h, sellPool.volume24h) / 100000;
    const confidence = Math.min((liquidityScore + volumeScore) / 2, 100);

    return {
      poolA: buyPool,
      poolB: sellPool,
      tokenIn: buyPool.tokenA,
      tokenOut: buyPool.tokenB,
      amountIn: maxSize,
      expectedProfit,
      profitPercentage,
      route: [buyPool.id, sellPool.id],
      confidence
    };
  }

  async findBestOpportunity(pools: Pool[]): Promise<ArbitrageOpportunity | null> {
    const opportunities = await this.scanForOpportunities(pools);
    return opportunities.length > 0 ? opportunities[0] : null;
  }

  setMinProfitThreshold(threshold: number): void {
    this.minProfitThreshold = threshold;
  }

  setMaxTradeSize(size: number): void {
    this.maxTradeSize = size;
  }
}
