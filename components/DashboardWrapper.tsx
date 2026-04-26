"use client"; 
import React from 'react'; 
import AnimatedLogo from './AnimatedLogo'; 
import CommandCenter from './CommandCenter'; 
import MarketIntelligence from './MarketIntelligence'; 

const DashboardWrapper = () => { 
    return ( 
          <div className="relative min-h-screen bg-black text-white p-4 md:p-8 geometric-grid"> 
                <div className="max-w-7xl mx-auto"> 
                        <header className="mb-12"> 
                                  <AnimatedLogo /> 
                        </header>header> 
                
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"> 
                                  <div className="lg:col-span-2"> 
                                              <CommandCenter /> 
                                  </div>div> 
                                  <div className="lg:col-span-1"> 
                                              <MarketIntelligence /> 
                                  </div>div> 
                        </div>div> 
                
                        <footer className="mt-12 pt-8 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-white/30 uppercase tracking-widest"> 
                                  <div>System_Status: Operational</div>div> 
                                  <div>v2.0.4-stable</div>div> 
                                  <div>Lat: 14ms</div>div> 
                        </footer>footer> 
                </div>div> 
          </div>div> 
        ); 
}; 

export default DashboardWrapper;
</div>
