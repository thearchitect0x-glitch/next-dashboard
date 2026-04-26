"use client"; 
import React from 'react'; 

const AnimatedLogo = () => { 
    return ( 
          <div className="relative flex items-center justify-center p-8 bg-black"> 
            {/* Background geometric shapes */} 
                <div className="absolute inset-0 overflow-hidden"> 
                        <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-white/10 rotate-45 animate-pulse" /> 
                        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 border border-white/5 -rotate-12 animate-bounce" style={{ animationDuration: '8s' }} /> 
                </div>div> 
          
                <div className="relative z-10 flex flex-col items-center"> 
                        <div className="text-6xl font-black tracking-tighter text-white mb-2 italic glow-text"> 
                                  BLACKSTAR <span className="text-white/50">V2</span>span> 
                        </div>div> 
                        <div className="h-1 w-full bg-gradient-to-r from-transparent via-white to-transparent" /> 
                        <div className="mt-2 text-xs font-mono tracking-[0.5em] text-white/40 uppercase"> 
                                  Geometric Frontrun Engine 
                        </div>div> 
                </div>div> 
          </div>div> 
        ); 
}; 

export default AnimatedLogo;
</div>
