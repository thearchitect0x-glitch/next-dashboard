{
  "name": "blackstar-v2-trading-bot",
  "version": "2.0.0",
  "description": "Multi-DEX Solana trading bot (pump.fun + Raydium)",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@solana/web3.js": "^1.87.6",
    "@solana/spl-token": "^0.4.0",
    "@raydium-io/raydium-sdk-v2": "^0.1.0",
    "decimal.js": "^10.4.3",
    "bs58": "^5.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.10.6",
    "@types/react": "^18.2.46",
    "@types/react-dom": "^18.2.18",
    "typescript": "^5.3.3",
    "eslint": "^8.56.0",
    "eslint-config-next": "14.0.4"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
