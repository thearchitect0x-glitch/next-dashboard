"use client"; 
import React, { useState, useEffect } from 'react'; 

const CommandCenter = () => { 
    const [logs, setLogs] = useState<{msg: string, time: string, type: string}[]>([]); 
    const [isScanning, setIsScanning] = useState(false); 

    useEffect(() => { 
                  if (isScanning) { 
            const interval = setInterval(() => { 
                                                 const dexes = ['Raydium AMM', 'Raydium CLMM', 'Pump.fun']; 
                                                 const dex = dexes[Math.floor(Math.random() * dexes.length)]; 
                                                 const newLog = { 
                                                             msg: `[${dex}] Scanning pool ${Math.random().toString(36).substring(7)}...`, 
                                                             time: new Date().toLocaleTimeString(), 
                                                             type: 'info' 
                                                 }; 
                                                 setLogs(prev => [newLog, ...prev].slice(0, 50)); 
            }, 1500); 
            return () => clearInterval(interval); 
                  } 
    }, [isScanning]); 

    return ( 
          <div className="border border-white/20 bg-black/40 backdrop-blur-md p-6 border-glow"> 
                <div className="flex justify-between items-center mb-6"> 
                        <h2 className="text-xl font-bold italic tracking-tighter text-white">COMMAND_CENTER</h2>h2> 
                        <button 
                                    onClick={() => setIsScanning(!isScanning)} 
                          className={`px-6 py-2 font-mono text-xs border transition-all ${ 
                                        isScanning  
                                          ? 'bg-white text-black border-white'  
                                          : 'bg-transparent text-white border-white/40 hover:border-white' 
                          }`} 
                        > 
                          {isScanning ? 'STOP_ENGINE' : 'INITIALIZE_SCANNER'} 
                        </button>button> 
                </div>div> 
          
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"> 
                        <div className="border border-white/10 p-4"> 
                                  <div className="text-[10px] text-white/40 mb-1 uppercase font-mono">Status</div>div> 
                                  <div className="text-xl font-bold text-white font-mono">{isScanning ? 'ACTIVE' : 'IDLE'}</div>div> 
                        </div>div> 
                        <div className="border border-white/10 p-4"> 
                                  <div className="text-[10px] text-white/40 mb-1 uppercase font-mono">DEX_Coverage</div>div> 
                                  <div className="text-xl font-bold text-white font-mono">3/3</div>div> 
                        </div>div> 
                        <div className="border border-white/10 p-4"> 
                                  <div className="text-[10px] text-white/40 mb-1 uppercase font-mono">Net_Profit_24h</div>div> 
                                  <div className="text-xl font-bold text-white font-mono">+1.24 SOL</div>div> 
                        </div>div> 
                </div>div> 
          
                <div className="bg-black/60 border border-white/5 p-4 h-64 overflow-y-auto font-mono text-[10px]"> 
                  {logs.map((log, i) => ( 
                      <div key={i} className="mb-1 flex"> 
                                  <span className="text-white/20 mr-2">[{log.time}]</span>span> 
                                  <span className="text-white/80">{log.msg}</span>span> 
                      </div>div> 
                    ))} 
                  {logs.length === 0 && <div className="text-white/20 italic">Awaiting initialization...</div>div>} 
                </div>div> 
          </div>div> 
        ); 
}; 

export default CommandCenter;
</div>
