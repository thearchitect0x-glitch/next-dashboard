"use client";
import React from 'react';

const NeuralHeatmap = () => {
    const nodes = Array.from({ length: 48 }, (_, i) => ({
          id: i,
          intensity: Math.random()
    }));

    return (
          <div className="border border-white/20 bg-black/40 backdrop-blur-md p-6 border-glow h-full relative overflow-hidden">
                <h2 className="text-xl font-bold italic tracking-tighter text-white mb-6 uppercase relative z-10">Neural_Heatmap</h2>h2>
                
                <div className="grid grid-cols-8 gap-2 relative z-10">
                  {nodes.map((node) => (
                      <div
                                    key={node.id}
                                    className="aspect-square border border-white/5 relative group"
                                  >
                                  <div 
                                                  className="absolute inset-0 transition-all duration-1000"
                                                  style={{ 
                                                                    backgroundColor: 'white',
                                                                    opacity: node.intensity * 0.3
                                                  }}
                                                />
                                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/20 flex items-center justify-center">
                                                <span className="text-[8px] font-mono text-white">{(node.intensity * 100).toFixed(0)}</span>span>
                                  </div>div>
                      </div>div>
                    ))}
                </div>div>
          
                <div className="mt-6 flex justify-between items-end relative z-10">
                        <div className="space-y-1">
                                  <div className="text-[10px] font-mono text-white/40">SYNAPTIC LOAD</div>div>
                                  <div className="text-2xl font-bold font-mono text-white italic tracking-tighter">
                                              88.4%
                                  </div>div>
                        </div>div>
                        <div className="text-[10px] font-mono text-white/20 uppercase">
                                  Processing...
                        </div>div>
                </div>div>
                
                <div className="absolute top-0 right-0 p-2">
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                </div>div>
          </div>div>
        );
};

export default NeuralHeatmap;
</div>
