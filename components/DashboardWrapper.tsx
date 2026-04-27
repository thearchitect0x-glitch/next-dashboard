"use client";
import React from 'react';
import AnimatedLogo from './AnimatedLogo';
import CommandCenter from './CommandCenter';
import MarketIntelligence from './MarketIntelligence';

const DashboardWrapper = () => (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
              <header className="mb-12 flex justify-between">
                      <AnimatedLogo />
              </header>
              <div className="grid grid-cols-3 gap-8">
                      <div className="col-span-2"><CommandCenter /></div>
                      <div className="col-span-1"><MarketIntelligence /></div>
              </div>
        </div>
    </div>
  );

export default DashboardWrapper;
