import React from 'react';
import { motion } from 'framer-motion';

export const MarketIntelligence = () => {
      return (
              <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100 h-full">
                    <div className="flex items-center justify-between mb-8">
                            <div>
                                      <h3 className="text-lg font-semibold text-slate-900">Market Intelligence</h3>
                                      <p className="text-sm text-slate-500">Real-time sentiment and trends</p>
                            </div>
                            <div className="flex gap-2">
                                {['24H', '7D', '1M'].map((period) => (
                              <button
                                                key={period}
                                                className={`px-3 py-1 text-xs font-medium rounded-full ${
                                                                    period === '24H' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600'
                                                }`}
                                              >
                                  {period}
                              </button>
                            ))}
                            </div>
                    </div>
              
                    <div className="space-y-6">
                        {[
                  { label: 'Global Sentiment', value: 85, trend: '+12%', color: 'bg-emerald-500' },
                  { label: 'Market Volatility', value: 34, trend: '-5%', color: 'bg-amber-500' },
                  { label: 'Trading Volume', value: 72, trend: '+8%', color: 'bg-blue-500' },
                          ].map((item) => (
                                        <div key={item.label} className="space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                                  <span className="text-slate-500">{item.label}</span>
                                                                  <span className="font-medium text-slate-900">{item.value}%</span>
                                                    </div>
                                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                                  <motion.div
                                                                                      initial={{ width: 0 }}
                                                                                      animate={{ width: `${item.value}%` }}
                                                                                      transition={{ duration: 1, ease: "easeOut" }}
                                                                                      className={`h-full rounded-full ${item.color}`}
                                                                                    />
                                                    </div>
                                                    <div className="flex justify-end">
                                                                  <span className={`text-xs font-medium ${
                                                            item.trend.startsWith('+') ? 'text-emerald-600' : 'text-amber-600'
                                        }`}>
                                                                      {item.trend}
                                                                  </span>
                                                    </div>
                                        </div>
                                      ))}
                    </div>
              </div>
            );
};
div>div>    div></div>
