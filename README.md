# Syber Tickets

Syber Tickets is a Web3 ticketing app for creating, buying, and returning event tickets on-chain. Tickets are represented by non-transferable, soulbound-style NFT records, which keeps tickets tied to the buyer's wallet and helps reduce scalping.

## Live Demo

Visit the deployed app:

[https://syber-tickets-2-0.vercel.app/](https://syber-tickets-2-0.vercel.app/)

The live version is configured for the [Base Sepolia testnet](https://sepolia.basescan.org/).

## Features

- Create events with a name, date, ticket price, return price, and max supply.
- Buy tickets directly from the smart contract.
- Return tickets through the contract for the configured return amount.
- Limit each wallet to a maximum of two tickets per event.
- Track available ticket supply and wallet-owned tickets in the UI.
- View transaction status feedback after buys and returns.

## Tech Stack

- React
- Redux Toolkit
- Ethers.js
- Solidity
- Hardhat
- Base Sepolia
- Vercel

## Network Details

The deployed contract currently used by the app is configured in [`src/config.json`](src/config.json).

| Network | Chain ID | Explorer | Contract |
| --- | ---: | --- | --- |
| Base Sepolia | `84532` | [BaseScan Sepolia](https://sepolia.basescan.org/) | [`0x7424511775770fC6F89ce91F779901d637e3Cc51`](https://sepolia.basescan.org/address/0x7424511775770fC6F89ce91F779901d637e3Cc51) |

To use the live app, connect a browser wallet such as MetaMask and switch to Base Sepolia.

## Run Locally

Clone the project and install dependencies:

```bash
git clone https://github.com/MaxSyber/Syber-Tickets-2.0.git
cd Syber-Tickets-2.0
npm install
```


## Local Blockchain Development

Start a local Hardhat node:

```bash
npx hardhat node
```

In a second terminal, deploy the contract to the local network:

```bash
npx hardhat run scripts/deploy.js --network localhost

```
Then Run the following command to seed the localhost with 4 preconfigured events

```bash

npx hardhat run scripts/seed.js --network localhost
```

The local chain configuration in [`src/config.json`](src/config.json) uses chain ID `31337`.

Start the React development server:

```bash
npm start
```

The app will run at:

```text
http://localhost:3000

## Available Scripts

```bash
npm start
```

Runs the app in development mode.

Creates a production build in the `build` folder.

```bash
npx hardhat test
```

Runs the smart contract test suite.

## Project Structure

```text
contracts/          Solidity smart contracts
scripts/            Hardhat deployment and seed scripts
src/                React app source
src/abis/           Contract ABI used by the frontend
src/components/     UI components
src/store/          Redux state and blockchain interactions
test/               Hardhat contract tests
```

## Status

Syber Tickets is actively evolving. Planned improvements include a richer admin portal, dedicated event management views, and a page for tracking tickets owned by the connected wallet.
