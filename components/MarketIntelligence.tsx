import React from 'react';
import { motion } from 'framer-motion';

export const MarketIntelligence = () => {
    return (
          <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100 h-full">
                <div className="flex items-center justify-between mb-8">
                        <div>
                                  <h3 className="text-lg font-semibold text-slate-900">Market Intelligence</h3>h3>
                                  <p className="text-sm text-slate-500">Real-time sentiment and trends</p>p>
                        </div>div>
                        <div className="flex gap-2">
                          {['24H', '7D', '1M'].map((period) => (
                        <button
                                        key={period}
                                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                                                          period === '24H' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600'
                                        }`}
                                      >
                          {period}
                        </button>button>
                      ))}
                        </div>div>
                </div>div>
          
                <div className="space-y-6">
                  {[
            { label: 'Global Sentiment', value: 85, trend: '+12%', color: 'bg-emerald-500' },
            { label: 'Market Volatility', value: 32, trend: '-5%', color: 'bg-amber-500' },
            { label: 'Institutional Flow', value: 64, trend: '+8%', color: 'bg-blue-500' },
                    ].map((item) => (
                                <div key={item.label}>
                                            <div className="flex justify-between items-center mb-2">
                                                          <span className="text-sm font-medium text-slate-700">{item.label}</span>span>
                                                          <span className="text-sm font-bold text-slate-900">{item.trend}</span>span>
                                            </div>div>
                                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                          <motion.div
                                                                            initial={{ width: 0 }}
                                                                            animate={{ width: `${item.value}%` }}
                                                                            transition={{ duration: 1, ease: "easeOut" }}
                                                                            className={`h-full ${item.color}`}
                                                                          />
                                            </div>div>
                                </div>div>
                              ))}
                </div>div>
          
                <div className="mt-8 p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3 text-slate-900 font-medium text-sm mb-2">
                                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                  Market Insight
                        </div>div>
                        <p className="text-sm text-slate-600 leading-relaxed">
                                  The market shows strong bullish sentiment with increasing institutional inflows. 
                                  Volatility remains within expected ranges for the current cycle.
                        </p>p>
                </div>div>
          </div>div>
        );
};</div>
