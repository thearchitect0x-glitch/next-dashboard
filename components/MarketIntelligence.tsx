"use client"; 
import React from 'react'; 

const MarketIntelligence = () => { 
    const signals = [ 
      { pair: 'SOL/USDC', type: 'LONG', confidence: 88, source: 'Raydium' }, 
      { pair: 'JUP/SOL', type: 'SHORT', confidence: 64, source: 'Meteora' }, 
      { pair: 'PYTH/SOL', type: 'LONG', confidence: 92, source: 'Orca' }, 
        ]; 

    return ( 
          <div className="border border-white/20 bg-black/40 backdrop-blur-md p-6 border-glow h-full"> 
                <h2 className="text-xl font-bold italic tracking-tighter text-white mb-6 uppercase">Market_Intelligence</h2>h2> 
                 
                <div className="space-y-6"> 
                  {signals.map((signal, i) => ( 
                      <div key={i} className="border-l-2 border-white/20 pl-4 py-2"> 
                                  <div className="flex justify-between items-center mb-1"> 
                                                <span className="text-xs font-mono text-white/40">{signal.pair}</span>span> 
                                                <span className={`text-[10px] px-2 py-0.5 font-mono ${ 
                                        signal.type === 'LONG' ? 'bg-white text-black' : 'border border-white text-white' 
                      }`}> 
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
          
                <div className="mt-12 p-4 bg-white/5 border border-white/10 rounded-sm"> 
                        <div className="text-[10px] font-mono text-white/40 uppercase mb-2">Global_Sentiment</div>div> 
                        <div className="h-1 bg-white/10 w-full overflow-hidden"> 
                                  <div className="h-full bg-white w-3/4" /> 
                        </div>div> 
                        <div className="flex justify-between mt-1 text-[8px] font-mono text-white/20 uppercase"> 
                                  <span>Bearish</span>span> 
                                  <span>Bullish</span>span> 
                        </div>div> 
                </div>div> 
          </div>div> 
        ); 
}; 

export default MarketIntelligence;
</div>
