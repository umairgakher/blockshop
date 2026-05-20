# Blockshop

A Web3 storefront frontend built with React, Vite, wagmi, RainbowKit, viem, and ethers. The app connects to a deployed smart contract on the Sepolia testnet, lets users connect with MetaMask or WalletConnect, displays live products from the contract, and allows purchases directly from the UI.

## Features

- Live product loading from the deployed Sepolia contract
- MetaMask and WalletConnect integration via wagmi and RainbowKit
- Buy flow using on-chain `placeOrder`
- Environment-based RPC and wallet configuration
- Product seeding script for the contract owner
- Modular frontend structure with reusable components

## Tech Stack

- React 18
- Vite
- wagmi
- RainbowKit
- viem
- ethers
- TailwindCSS

## Contract

- Network: `Sepolia`
- Chain ID: `11155111`
- Contract Address: `0x3381d2f3E5d41c33D85C203621C3974d10B468D8`

## Environment Variables

Create a `.env.local` file in the project root.

Use this template:

```dotenv
VITE_ANKR_API_KEY=your_ankr_api_key
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
VITE_SEPOLIA_RPC_URL=https://rpc.sepolia.org
SEPOLIA_PRIVATE_KEY=your_wallet_private_key
```

### Notes

- `VITE_WALLETCONNECT_PROJECT_ID`
  - Required for wallet connection UI.

- `VITE_ANKR_API_KEY`
  - Optional but recommended.
  - Used to build the authenticated Ankr Sepolia RPC URL.

- `VITE_SEPOLIA_RPC_URL`
  - Fallback Sepolia RPC URL.
  - Used by the frontend and seed script if Ankr is unavailable.

- `SEPOLIA_PRIVATE_KEY`
  - Only used by the owner seed script.
  - Do not expose this publicly.
  - Do not prefix it with `VITE_`.

## Installation

```bash
npm install
```

## Run the Frontend

```bash
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Build for Production

```bash
npm run build
npm run preview
```

## Seed Products to the Contract

The owner wallet can seed products directly on-chain using:

```bash
npm run seed:products
```

This script:

- reads environment variables from `.env.local`
- validates the owner wallet
- tries multiple Sepolia RPC endpoints if needed
- submits `createProduct` transactions for the sample products

## Frontend Structure

```text
src/
  components/
    AppHeader.jsx
    EmptyState.jsx
    NoticeBanner.jsx
    ProductCard.jsx
    ProductGrid.jsx
    ProductsSection.jsx
    Toast.jsx
  utils/
    formatters.js
    product.js
  contracts/
    blockshop.js
  data/
    sampleProducts.js
  App.jsx
  index.css
  main.jsx
  providers.jsx
  wagmi.js
```

## Wallet Support

The frontend supports:

- MetaMask via injected connector
- WalletConnect via RainbowKit/wagmi

The app expects the wallet to be connected to Sepolia.

## Common Issues

### Unauthorized Ankr RPC errors

If you see unauthorized RPC errors, ensure `VITE_ANKR_API_KEY` is set correctly or use a public fallback RPC in `VITE_SEPOLIA_RPC_URL`.

### RPC timeout

If the RPC times out, switch `VITE_SEPOLIA_RPC_URL` to another Sepolia endpoint, for example:

```dotenv
VITE_SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
```

### Wallet connected but wrong network

Switch your wallet to Sepolia testnet.

## Security

- Keep `.env.local` out of version control.
- Never commit private keys.
- If a private key has been exposed, treat it as compromised and rotate to a new wallet.

## Scripts

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run seed:products`

## Status

- Frontend integrated with wagmi and RainbowKit
- Smart contract reads/writes wired to Sepolia
- Product seed script added
- Frontend structure refactored into reusable components
