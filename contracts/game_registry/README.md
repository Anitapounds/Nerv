# Game Registry Smart Contract

A Move smart contract for OneChain blockchain that manages game submissions with a 0.1 OCT token fee.

## Features

- Game submission with 0.1 OCT fee
- Automatic fee transfer to registry owner
- Stores game metadata on-chain
- View functions for querying games and statistics

## Contract Overview

### Fee Structure
- **Fee Amount**: 0.1 OCT (100,000,000 in smallest unit)
- **Payment Method**: Users pay with OCT tokens (OneChain native token)
- **Fee Distribution**: Fees are transferred to the registry owner

### Functions

#### `submit_game`
Submit a new game to the registry by paying the required fee.

**Parameters:**
- `registry`: Mutable reference to GameRegistry
- `name`: Game name as bytes
- `metadata`: Game metadata (IPFS hash, description, etc.) as bytes
- `payment`: Coin<OCT> with at least 0.1 OCT
- `clock`: Reference to Clock object
- `ctx`: Transaction context

**Behavior:**
1. Validates payment is >= 0.1 OCT
2. Splits fee from payment
3. Transfers fee to registry owner
4. Returns excess payment to sender
5. Stores game data with developer address and timestamp

#### View Functions
- `get_games`: Returns all games in the registry
- `get_games_count`: Returns total number of games
- `get_total_fees`: Returns total fees collected

## Deployment Instructions

### Prerequisites
1. Install Sui CLI (OneChain uses Sui/Move framework)
2. Configure OneChain network in Sui config
3. Fund your wallet with OCT tokens

### Build the Contract
```bash
cd contracts/game_registry
sui move build
```

### Deploy the Contract
```bash
sui client publish --gas-budget 100000000
```

### Save Important Values
After deployment, save these values:
- **Package ID**: The published package address
- **GameRegistry Object ID**: The shared object ID created during init

## Integration with Frontend

The frontend needs to:
1. Connect to OneChain wallet (Sui wallet compatible)
2. Call `submit_game` with:
   - Game name
   - Metadata (IPFS URLs, description)
   - Payment of 0.1 OCT
   - Clock object (0x6 on most Sui-based chains)

## Testing

Run tests:
```bash
sui move test
```

## Security Notes

- Contract validates payment amount
- Excess payment is automatically returned
- Fees are immediately transferred (not stored in contract)
- Game data is immutable once submitted
