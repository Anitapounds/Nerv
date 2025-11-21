# NERV Gaming Platform

A decentralized gaming platform built on OneChain blockchain, enabling game developers to submit and showcase their games while gamers discover and play exciting blockchain-integrated games.

## Overview

NERV is a Next.js-based gaming platform that integrates with OneChain (Sui-based blockchain) to provide a decentralized game registry system. Developers can submit their games by paying a 0.1 OCT fee, and all game metadata is stored on-chain for transparency and permanence.

## Features

- **Game Discovery**: Browse and explore games across multiple genres
- **Developer Portal**: Submit and manage games with blockchain verification
- **OneChain Integration**: Secure wallet connection using OneLabs dApp Kit
- **On-Chain Registry**: All games registered on the blockchain
- **IPFS Storage**: Decentralized storage for game assets via Pinata
- **Live Gaming**: Real-time gaming experiences with leaderboards
- **User Profiles**: Personalized gaming profiles and dashboards
- **Tipping System**: Support your favorite creators with on-chain tips

## Tech Stack

### Frontend

- **Framework**: Next.js 15.5.6 with React 19
- **Styling**: TailwindCSS 4.1.15
- **Animations**: Framer Motion
- **Icons**: Lucide React, Font Awesome
- **State Management**: TanStack React Query 5.90.7
- **Type Safety**: TypeScript 5

### Blockchain Integration

- **Blockchain**: OneChain (Sui-based)
- **Wallet**: OneLabs Wallet Kit (@onelabs/dapp-kit)
- **Smart Contract Language**: Move
- **Network**: OneChain Mainnet/Testnet

### Storage & APIs

- **IPFS**: Pinata (v2.5.1) for decentralized file storage
- **Image Optimization**: Sharp for Next.js image processing

## Project Structure

```
nerv_frontend/
├── contracts/
│   └── game_registry/              # Move smart contracts
│       ├── sources/
│       │   └── game_registry.move  # Main contract
│       ├── tests/
│       │   └── game_registry_tests.move
│       ├── Move.toml               # Contract configuration
│       └── README.md               # Contract documentation
├── src/
│   ├── app/                        # Next.js App Router pages
│   │   ├── page.tsx                # Home/Signup page
│   │   ├── dashboard/              # User dashboard
│   │   ├── developer/              # Developer portal
│   │   ├── developerforgame/      # Game submission
│   │   ├── discovery/              # Game discovery
│   │   ├── games/                  # Individual game pages
│   │   ├── login/                  # Authentication
│   │   ├── ongoing-live/           # Live gaming
│   │   ├── profile/                # User profiles
│   │   └── api/                    # API routes
│   │       └── upload/             # IPFS upload endpoint
│   ├── components/                 # React components
│   │   ├── navbar.tsx
│   │   ├── WalletConnectButton.tsx
│   │   ├── ChatSidebar.tsx
│   │   ├── TipModal.tsx
│   │   ├── Toast.tsx
│   │   └── ui/                     # UI components
│   ├── lib/                        # Utilities and configs
│   │   ├── gameRegistry.ts         # Contract interaction
│   │   ├── motion.tsx              # Animation utilities
│   │   └── utils.ts                # Helper functions
│   └── providers/
│       └── OneLabsProvider.tsx     # Blockchain provider
├── public/                         # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## Smart Contract Details

### Game Registry Contract

**Location**: `contracts/game_registry/sources/game_registry.move`

**Package Dependencies**:

- OneChain Framework (Move standard library)

**Contract Address**:

- Package ID: Set via `NEXT_PUBLIC_PACKAGE_ID`
- Registry Object ID: Set via `NEXT_PUBLIC_REGISTRY_ID`

**Deployed Contract Details**:

```
Package ID: 0xec1f22ebe5d8a48a9b3e2afa086511c55cc263a59e91e4b07fcaea615be20185
Registry Object ID: 0xefbe5aba9eec046be27608d3e47c041b1fee94d899772b6f0be6c32e09b6b724
Clock Object ID: 0x6
Fee Amount: 100000000 (0.1 OCT)
```

### Contract Functions

#### `submit_game`

Submit a new game to the registry with payment.

**Parameters**:

- `registry`: `&mut GameRegistry` - Mutable reference to the registry
- `name`: `vector<u8>` - Game name as bytes
- `metadata`: `vector<u8>` - JSON metadata as bytes
- `payment`: `Coin<OCT>` - Payment of at least 0.1 OCT
- `clock`: `&Clock` - Clock object for timestamp (0x6)
- `ctx`: `&mut TxContext` - Transaction context

**Fee Structure**:

- **Amount**: 0.1 OCT (100,000,000 smallest units)
- **Recipient**: Registry owner
- **Excess**: Automatically refunded to sender

**Stored Data**:

```move
public struct Game {
    developer: address,      // Developer's wallet address
    name: vector<u8>,        // Game name
    metadata: vector<u8>,    // JSON metadata (IPFS, description, etc.)
    submitted_at: u64,       // Timestamp in milliseconds
}
```

#### View Functions

- `get_games(registry)`: Returns all registered games
- `get_games_count(registry)`: Returns total number of games
- `get_total_fees(registry)`: Returns total fees collected

### Contract Deployment

#### Prerequisites

1. Install Sui CLI
2. Configure OneChain network
3. Fund wallet with OCT tokens

#### Build Contract

```bash
cd contracts/game_registry
sui move build
```

#### Deploy Contract

```bash
sui client publish --gas-budget 100000000
```

#### Post-Deployment

Save these values to your `.env.local`:

- `NEXT_PUBLIC_PACKAGE_ID`: Published package address
- `NEXT_PUBLIC_REGISTRY_ID`: Shared GameRegistry object ID
- `NEXT_PUBLIC_CLOCK_ID`: Clock object (usually `0x6`)

## Installation

### Prerequisites

- Node.js 20+
- npm or yarn
- OneChain-compatible wallet

### Setup

1. Clone the repository

```bash
git clone <repository-url>
cd nerv_frontend
```

2. Install dependencies

```bash
npm install
```

3. Configure environment variables

Create a `.env.local` file in the root:

```env
# OneChain Smart Contract Configuration
# Package ID: The published package address from deployment
NEXT_PUBLIC_PACKAGE_ID=0xec1f22ebe5d8a48a9b3e2afa086511c55cc263a59e91e4b07fcaea615be20185
# GameRegistry Object ID: The shared object ID created during init
NEXT_PUBLIC_REGISTRY_ID=0xefbe5aba9eec046be27608d3e47c041b1fee94d899772b6f0be6c32e09b6b724
# Clock Object ID: Standard clock object (usually 0x6 on Sui-based chains)
NEXT_PUBLIC_CLOCK_ID=0x6
# Fee in OCT tokens (0.1 OCT)
NEXT_PUBLIC_FEE_AMOUNT=100000000

# WalletConnect Configuration
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Pinata IPFS Configuration
# Get your JWT token from https://app.pinata.cloud/developers/api-keys
# NOTE: This is a server-side secret and should NOT be exposed to the client
PINATA_JWT=your_pinata_jwt_token
NEXT_PUBLIC_GATEWAY_URL=your_pinata_gateway_url
```

4. Run development server

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Building for Production

```bash
npm run build
npm start
```

## Environment Variables

| Variable                               | Description                                    | Required | Default Value                                                      |
| -------------------------------------- | ---------------------------------------------- | -------- | ------------------------------------------------------------------ |
| `NEXT_PUBLIC_PACKAGE_ID`               | Move package ID of deployed contract           | Yes      | 0xec1f22ebe5d8a48a9b3e2afa086511c55cc263a59e91e4b07fcaea615be20185 |
| `NEXT_PUBLIC_REGISTRY_ID`              | GameRegistry shared object ID                  | Yes      | 0xefbe5aba9eec046be27608d3e47c041b1fee94d899772b6f0be6c32e09b6b724 |
| `NEXT_PUBLIC_CLOCK_ID`                 | Clock object ID (standard on OneChain)         | No       | 0x6                                                                |
| `NEXT_PUBLIC_FEE_AMOUNT`               | Fee amount in smallest unit (0.1 OCT)          | No       | 100000000                                                          |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect project ID                       | Yes      | -                                                                  |
| `PINATA_JWT`                           | Pinata API JWT token (server-side)             | Yes      | -                                                                  |
| `NEXT_PUBLIC_GATEWAY_URL`              | Pinata IPFS gateway URL                        | Yes      | -                                                                  |

## Usage

### For Gamers

1. Connect your OneChain wallet
2. Browse games in the Discovery section
3. Play games and compete on leaderboards
4. Tip your favorite creators

### For Developers

1. Connect your OneChain wallet
2. Navigate to the Developer Portal
3. Fill in game details (name, description, genre, etc.)
4. Upload game assets (logo, video) to IPFS
5. Submit game with 0.1 OCT payment
6. Game appears on-chain and in the registry

## Contract Integration

The frontend interacts with the smart contract through `src/lib/gameRegistry.ts`:

```typescript
import { createSubmitGameTransaction } from "@/lib/gameRegistry";

// Create transaction
const tx = createSubmitGameTransaction({
  name: "My Game",
  description: "Game description",
  genre: "Action",
  platforms: ["Web", "Mobile"],
  releaseDate: "2025-01-01",
  websiteUrl: "https://mygame.com",
  logoUrl: "ipfs://...",
  videoUrl: "ipfs://...",
});

// Sign and execute with wallet
await signAndExecuteTransaction({ transaction: tx });
```

## Security Considerations

- All transactions require wallet signature
- Contract validates payment amounts
- Excess payment automatically refunded
- Game data immutable after submission
- No centralized storage of sensitive data
- All metadata stored on IPFS (decentralized)

## Testing

### Frontend Tests

```bash
npm test
```

### Contract Tests

```bash
cd contracts/game_registry
sui move test
```

## Roadmap

- [ ] Add game reviews and ratings
- [ ] Implement tournaments and prizes
- [ ] Multi-chain support
- [ ] NFT integration for achievements
- [ ] Improved analytics dashboard
- [ ] Social features and friend systems

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:

- Open an issue on GitHub
- Check the [Contract Documentation](contracts/game_registry/README.md)
- Review OneChain documentation

## Acknowledgments

- Built on [OneChain](https://onechain.io)
- Powered by [OneLabs dApp Kit](https://docs.onelabs.cc)
- IPFS storage via [Pinata](https://pinata.cloud)
- UI components with [TailwindCSS](https://tailwindcss.com)

---

**Built with ❤️ by the NERV Team**
