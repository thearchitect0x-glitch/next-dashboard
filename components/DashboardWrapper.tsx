'use client';
import React, { useState, useEffect } from 'react';
import { CommandCenter } from './CommandCenter';
import { AnimatedLogo } from './AnimatedLogo';

export default function DashboardWrapper() {
    const [stats, setStats] = useState({ balance: 0.423, status: 'CONNECTED', autorun: false, profit: 0, spending: 0 });

  useEffect(() => {
        const fetchStatus = async () => {
                try {
                          const res = await fetch('/api/stats');
                          const data = await res.json();
                          if (data && !data.error) {
                                      setStats(prev => ({ 
                                                                    ...prev, 
                                                    balance: data.balance, 
                                                    profit: data.totalProfit,
                                                    status: 'CONNECTED' 
                                      }));
                          }
                } catch (e) {
                          setStats(prev => ({ ...prev, status: 'SYNC_ERROR' }));
                }
        };
        const id = setInterval(fetchStatus, 10000);
        fetchStatus();
        return () => clearInterval(id);
  }, []);

  return (
        <div className="min-h-screen bg-[#FCF9F2] text-[#292e30] font-mono overflow-x-hidden selection:bg-[#292e30] selection:text-white">
              <header className="border-b-2 border-[#292e30] p-4 flex justify-between items-center bg-[#292e30] text-white">
                      <div className="flex items-center gap-3">
                                <div className="bg-[#FFB000] p-2 rounded-sm border border-white/20">
                                             <AnimatedLogo size={32} />
                                </div>div>
                                <div>
                                            <h1 className="font-black italic tracking-tighter text-2xl leading-none">BLACKSTAR V2</h1>h1>
                                            <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#FFB000]">Geometric Frontrun Engine</p>p>
                                </div>div>
                      </div>div>
                      <div className="flex gap-6 text-[10px] font-black uppercase">
                                <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-[#00FF00] animate-pulse"></div>div>
                                            <span>MAINNET_ULTRA_SYNC</span>span>
                                </div>div>
                                <div className="text-right">
                                            <div className="opacity-50">Primary Signer</div>div>
                                            <div className="text-[#00FF00]">3KrLbAZE...uUQW</div>div>
                                </div>div>
                      </div>div>
              </header>header>
        
              <main className="p-6 max-w-[1400px] mx-auto grid grid-cols-12 gap-6">
                      <div className="col-span-9 space-y-6">
                                 <CommandCenter stats={stats} />
                      </div>div>
                      
                      <div className="col-span-3 space-y-6">
                                <div className="border-2 border-black p-4 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                            <div className="text-[10px] font-black opacity-30 mb-2 uppercase">Session PNL</div>div>
                                            <div className="text-4xl font-black italic tracking-tighter mb-4">+0.000</div>div>
                                            <div className="text-lg font-black text-[#00FF00] uppercase tracking-tighter">SOLANA (SOL)</div>div>
                                            <div className="mt-6 pt-6 border-t border-black/10 space-y-2 text-[10px] font-bold uppercase">
                                                           <div className="flex justify-between"><span>Avg Win</span>span><span className="text-black">+0.25 SOL</span>span></div>div>
                                                           <div className="flex justify-between"><span>Win Rate</span>span><span className="text-black">94.1%</span>span></div>div>
                                            </div>div>
                                            <button className="w-full bg-black text-white py-3 mt-8 font-black uppercase text-xs hover:bg-[#FFB000] hover:text-black transition-colors">
                                                          Settlement
                                            </button>button>
                                </div>div>
                      </div>div>
              </main>main>
        </div>div>
      );
}</div>
