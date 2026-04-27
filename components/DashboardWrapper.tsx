'use client';

import React, { useState, useEffect } from 'react';
import { CommandCenter } from './CommandCenter';
import { AnimatedLogo } from './AnimatedLogo';

export default function DashboardWrapper() {
    const [stats, setStats] = useState({ balance: 0.423, status: 'CONNECTED', autorun: false, profit: 0.112 });

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
        <div className="min-h-screen bg-[#050505] text-[#00ff9d] p-4 font-mono selection:bg-[#00ff9d] selection:text-black">
              <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Section */}
                      <div className="flex justify-between items-start border border-[#00ff9d]/30 bg-black/50 p-6 rounded-lg backdrop-blur-sm relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-r from-[#00ff9d]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative z-10">
                                            <div className="flex items-center gap-4 mb-2">
                                                          <AnimatedLogo />
                                                          <h1 className="text-3xl font-black tracking-tighter uppercase italic">GLITCH_OS <span className="text-xs not-italic font-normal opacity-50 ml-2">v2.4.0-PRO</span>span></h1>h1>
                                            </div>div>
                                            <div className="flex gap-4 text-xs opacity-70">
                                                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#00ff9d] animate-pulse"></span>span> SYSTEM_READY</span>span>
                                                          <span>NETWORK: PROXY_ENABLED</span>span>
                                                          <span>LATENCY: 24ms</span>span>
                                            </div>div>
                                </div>div>
                                <div className="text-right relative z-10">
                                            <div className="text-xs uppercase opacity-50 mb-1 font-bold">Total Liquidity</div>div>
                                            <div className="text-4xl font-black tracking-tighter">{stats.balance.toFixed(3)} ETH</div>div>
                                </div>div>
                      </div>div>
              
                {/* Status Bar */}
                      <div className="grid grid-cols-4 gap-4">
                                <div className="bg-black/40 border border-[#00ff9d]/20 p-4 rounded flex justify-between items-center">
                                            <span className="text-xs uppercase opacity-50">Pulse</span>span>
                                            <span className={stats.status === 'CONNECTED' ? 'text-[#00ff9d]' : 'text-red-500'}>{stats.status}</span>span>
                                </div>div>
                                <div className="bg-black/40 border border-[#00ff9d]/20 p-4 rounded flex justify-between items-center">
                                            <span className="text-xs uppercase opacity-50">Autorun</span>span>
                                            <span className="text-orange-500">DISABLED</span>span>
                                </div>div>
                                <div className="bg-black/40 border border-[#00ff9d]/20 p-4 rounded flex justify-between items-center">
                                            <span className="text-xs uppercase opacity-50">Profit 24h</span>span>
                                            <span className="text-[#00ff9d] font-bold">+{stats.profit.toFixed(3)} ETH</span>span>
                                </div>div>
                                <div className="bg-black/40 border border-[#00ff9d]/20 p-4 rounded flex justify-between items-center">
                                            <span className="text-xs uppercase opacity-50">Nodes</span>span>
                                            <span>12/12 ACTIVE</span>span>
                                </div>div>
                      </div>div>
              
                {/* Main Content */}
                      <CommandCenter />
              </div>div>
        
          {/* Footer / System Info */}
              <div className="mt-8 pt-4 border-t border-[#00ff9d]/10 text-[10px        <div>(c) 2024 GLITCH_LABS // ALL RIGHTS RESERVED</div>
                        <div>SECURED_CONNECTION_AES_256</div>
                </div>
                </div>
                  );
                }
                ] opacity-30 flex justify-between uppercase tracking-widest">
                      <div></div>
