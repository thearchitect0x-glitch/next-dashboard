"use client";
import React from 'react';

const MarketIntelligence = () => {
  return (
    <div className="border border-white/20 bg-black/40 backdrop-blur-sm p-4">
      <h2 className="text-xl font-bold italic tracking-tighter mb-4 text-white uppercase">MARKET INTELLIGENCE</h2>
      <div className="space-y-6">
        {[
          { pair: 'SOL/USDC', type: 'LONG', confidence: 88, source: 'JUPITER' },
          { pair: 'JUP/SOL', type: 'SHORT', confidence: 64, source: 'RAYDIUM' }
        ].map((signal, i) => (
          <div key={i} className="border-l-2 border-white/10 pl-4 py-2">
            <div className="flex justify-between items-end mb-2">
              <span className="text-[10px] opacity-50 text-white font-mono">{signal.source} AGGREGATOR</span>
              <span className="text-[10px] bg-white/10 px-1 text-white font-mono">{signal.confidence}% CONFIDENCE</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-lg font-black tracking-tight text-white font-mono">{signal.pair}</div>
              <div className={`text-xs font-black px-2 py-1 ${signal.type === 'LONG' ? 'bg-white text-black' : 'bg-red-500 text-white'}`}>
                {signal.type}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketIntelligence;
