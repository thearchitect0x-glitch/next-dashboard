"use client";
import React from 'react';
import AnimatedLogo from './AnimatedLogo';
import CommandCenter from './CommandCenter';
import MarketIntelligence from './MarketIntelligence';

const DashboardWrapper = () => (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
              <header className="mb-12 flex justify-between">
                      <AnimatedLogo />"use client"
              import React, { useState, useEffect } from 'react'
              import CommandCenter from './CommandCenter'
              import MarketIntelligence from './MarketIntelligence'
              import NeuralHeatmap from './NeuralHeatmap'
              import AnimatedLogo from './AnimatedLogo'
              import QuickStats from './QuickStats'
              import SystemAlerts from './SystemAlerts'
              
              const DashboardWrapper = () => {
                    const [mounted, setMounted] = useState(false)
                const [time, setTime] = useState("")
              
                useEffect(() => {
                        setMounted(true)
                        const timer = setInterval(() => {
                                  setTime(new Date().toLocaleTimeString())
                        }, 1000)
                  return () => clearInterval(timer)
                  }, [])
              
                if (!mounted) return null
              
                return (
                  <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
                      {/* Background Grid */}
                        <div className="fixed inset-0 bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:20px_20px] opacity-25 pointer-events-none" />
                        
                      {/* Header Bar */}
                        <header className="relative z-10 border-b border-white/10 px-6 py-4 flex justify-between items-center bg-black/50 backdrop-blur-md">
                                <div className="flex items-center space-x-4">
                                          <AnimatedLogo />
                                          <div className="h-8 w-[1px] bg-white/10" />
                                          <div className="font-mono text-xs tracking-tighter">
                                                      <div className="text-white/40 uppercase">System_Active</div>div>
                                                      <div className="text-white tabular-nums">{time}</div>div>
                                          </div>div>
                                </div>div>
                                <div className="flex items-center space-x-6 text-[10px] font-mono">
                                          <div className="flex items-center space-x-2">
                                                      <div className="w-1.5 h-1.5 bg-white animate-pulse rounded-full" />
                                                      <span className="text-white/60">LIVE_DATA_STREAM</span>span>
                                          </div>div>
                                          <button className="border border-white/20 px-3 py-1 hover:bg-white hover:text-black transition-all duration-300">
                                                      CONNECT_WALLET
                                          </button>button>
                                </div>div>
                        </header>header>
                  
                        <main className="relative z-10 p-6 grid grid-cols-12 gap-6 max-w-[1600px] mx-auto">
                            {/* Left Column: Quick Stats & Alerts */}
                                <div className="col-span-12 lg:col-span-3 space-y-6">
                                          <section className="border border-white/10 p-4 bg-white/5 backdrop-blur-sm">
                                                      <h3 className="text-[10px] font-mono text-white/40 mb-6 uppercase tracking-widest flex justify-between">
                                                                    Core_Metrics
                                                                    <span className="text-white/20">[01]</span>span>
                                                      </h3>h3>
                                                      <QuickStats />
                                          </section>section>
                                
                                          <section className="border border-white/10 p-4 bg-white/5 backdrop-blur-sm">
                                                      <h3 className="text-[10px] font-mono text-white/40 mb-6 uppercase tracking-widest flex justify-between">
                                                                    Incident_Log
                                                                    <span className="text-white/20">[02]</span>span>
                                                      </h3>h3>
                                                      <SystemAlerts />
                                          </section>section>
                                </div>div>
                        
                            {/* Center: Main Visualization */}
                                <div className="col-span-12 lg:col-span-6 space-y-6">
                                          <section className="border border-white/10 bg-white/5 backdrop-blur-sm aspect-video relative group overflow-hidden">
                                                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none" />
                                                      <div className="absolute top-4 left-4 z-20">
                                                                    <h2 className="text-xs font-mono tracking-widest text-white uppercase">Neural_Network_Activity</h2>h2>
                                                                    <p className="text-[10px] font-mono text-white/40">Real-time node distribution map</p>p>
                                                      </div>div>
                                                      <NeuralHeatmap />
                                          </section>section>
                                          
                                          <CommandCenter />
                                </div>div>
                        
                            {/* Right Column: Market Intelligence */}
                                <div className="col-span-12 lg:col-span-3">
                                          <section className="border border-white/10 p-4 bg-white/5 backdrop-blur-sm h-full">
                                                      <h3 className="text-[10px] font-mono text-white/40 mb-6 uppercase tracking-widest flex justify-between">
                                                                    Market_Intel
                                                                    <span className="text-white/20">[03]</span>span>
                                                      </h3>h3>
                                                      <MarketIntelligence />
                                          </section>section>
                                </div>div>
                        </main>main>
                  
                      {/* Terminal Footer Overlay */}
                        <footer className="fixed bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-black/80 backdrop-blur-md px-4 py-1">
                                <div className="flex justify-between items-center text-[8px] font-mono text-white/20 uppercase tracking-tighter">
                                          <span>Terminal_v.2.4.0_Build_882</span>span>
                                          <span>Buffer_Status: Optimal</span>span>
                                          <span></header>
              <div className="grid grid-cols-3 gap-8">
                      <div className="col-span-2"><CommandCenter /></div>
                      <div className="col-span-1"><MarketIntelligence /></div>
              </div>
        </div>
    </div>
  );

export default DashboardWrapper;
