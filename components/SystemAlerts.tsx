"use client"
import React from 'react'

const SystemAlerts = () => {
    const alerts = [
      { type: "CRITICAL", msg: "KERNEL_REDACTED", time: "2m ago" },
      { type: "WARNING", msg: "SYNC_LATENCY_HIGH", time: "14m ago" },
      { type: "INFO", msg: "NEW_NODE_CONNECTED", time: "26m ago" },
        ]

    return (
          <div className="space-y-4">
            {alerts.map((alert, i) => (
                    <div key={i} className="flex items-start space-x-3 group">
                              <div className={`mt-1.5 w-1.5 h-1.5 rounded-full ${
                                  alert.type === 'CRITICAL' ? 'bg-white animate-ping' : 
                                  alert.type === 'WARNING' ? 'bg-white/60' : 'bg-white/20'
                    }`} />
                              <div className="flex-1">
                                          <div className="flex justify-between items-baseline">
                                                        <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{alert.type}</span>span>
                                                        <span className="text-[8px] font-mono text-white/20">{alert.time}</span>span>
                                          </div>div>
                                          <div className="text-[11px] font-mono text-white group-hover:translate-x-1 transition-transform duration-300">
                                            {alert.msg}
                                          </div>div>
                              </div>div>
                    </div>div>
                  ))}
          </div>div>
        )
}
  
  export default SystemAlerts
    </div>
