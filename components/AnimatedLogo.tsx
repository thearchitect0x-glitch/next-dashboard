"use client";
import React from 'react';
const AnimatedLogo = () => {
    return (
          <div className="relative group cursor-pointer">
                <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 border-2 border-white flex items-center justify-center relative overflow-hidden">
                                  <div className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                                  <span className="relative z-10 font-bold text-white group-hover:text-black transition-colors duration-500">G</span>span>
                        </div>div>
                        <div className="flex flex-col">
                                  <span className="text-sm font-bold tracking-[0.2em] text-white leading-none">GLITCH</span>span>
                                  <span className="text-[8px] font-mono text-white/40 tracking-[0.4em] mt-1">SYSTEM_OS_V2</span>span>
                        </div>div>
                </div>div>
                <div className="absolute -bottom-4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
          </div>div>
        );
};

export default AnimatedLogo;</div>
