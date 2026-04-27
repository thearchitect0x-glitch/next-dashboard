"use client"
import React from 'react'

const QuickStats = () => {
    const stats = [
      { label: "UPTIME", value: "99.9%", color: "text-white" },
      { label: "LATENCY", value: "14MS", color: "text-white" },
      { label: "THREATS", value: "0", color: "text-white/40" },
        ]

    return (
          <div className="flex flex-col space-y-4">
            {stats.map((stat, i) => (
                    <div key={i} className="border-l border-white/20 pl-4 py-1 group hover:border-white transition-colors duration-300">
                              <div className="text-[10px] font-mono text-white/40 tracking-widest uppercase mb-1">
                                {stat.label}
                              </div>div>
                              <div className={`text-xl font-bold font-mono italic tracking-tighter ${stat.color}`}>
                                {stat.value}
                              </div>div>
                    </div>div>
                  ))}
                
                <div className="pt-4 mt-auto">
                        <div className="h-1 w-full bg-white/5 relative overflow-hidden">
                                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                        </div>div>
                        <div className="text-[8px] font-mono text-white/20 mt-2 uppercase tracking-tighter">
                                  System_Healthy_Proceed
                        </div>div>
                </div>div>
          </div>div>
        )
}
  
  export default QuickStats
    </div>
