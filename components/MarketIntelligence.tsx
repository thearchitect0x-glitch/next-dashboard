"use client";
import React from 'react';

const MarketIntelligence = () => {
      return (
              <div className="border border-white/20 bg-black/40 backdrop-blur-md p-6 border-glow h-full">
                      <h2 className="text-xl font-bold italic tracking-tighter text-white mb-6 uppercase">Market_Intelligence</h2>h2>
                      <div className="space-y-6">
                        {[
                { pair: 'SOL/USDC', type: 'LONG', confidence: 88, source: 'Raydium' },
                { pair: 'JUP/SOL', type: 'SHORT', confidence: 64, source: 'Meteora' }
                          ].map((signal, i) => (
                                        <div key={i} className="border-l-2 border-white/20 pl-4 py-2">
                                                      <div className="flex justify-between items-center mb-1">
                                                                      <span className="text-xs font-mono text-white/40">{signal.pair}</span>span>
                                                                      <span className={`text-[10px] px-2 py-0.5 font-mono ${signal.type === 'LONG' ? 'bg-white text-black' : 'border border-white text-white'}`}>
                                                                        {signal.type}
                                                                      </span>span>
                                                      </div>div>
                                                      <div className="text-lg font-bold font-mono text-white mb-1">
                                                        {signal.confidence}% CONFIDENCE
                                                      </div>div>
                                                      <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
                                                                      Source: {signal.source}
                                                      </div>div>
                                        </div>div>
                                      ))}
                      </div>div>
              </div>div>
            );
};

export default MarketIntelligence;
</div>
