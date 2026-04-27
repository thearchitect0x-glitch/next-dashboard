import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedLogo = ({ size = 100 }: { size?: number }) => {
    return (
          <div style={{ width: size, height: size }} className="relative flex items-center justify-center">
                <motion.svg
                          viewBox="0 0 100 100"
                          className="w-full h-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        >
                        <circle cx="50" cy="50" r="48" fill="none" stroke="black" strokeWidth="0.5" strokeDasharray="2 2" />
                        <circle cx="50" cy="50" r="35" fill="none" stroke="black" strokeWidth="0.2" />
                        <motion.circle
                                    cx="50" cy="15" r="2" fill="black"
                                    animate={{ scale: [1, 1.5, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                  />
                </motion.svg>motion.svg>
                <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                                    className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-b-[25px] border-b-black"
                                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                  />
                </div>div>
          </div>div>
        );
};
</div>
