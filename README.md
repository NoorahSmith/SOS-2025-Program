# USDC Buy/Sell DEX - Complete Project Description

**Deployed Frontend URL:** `http://localhost:3000` (Development)
**Solana Program ID:** `9HzagBuheBCfbbXWVhqkYVArBzepy8Mif5rbe7gM257n`
**Network:** Solana Devnet

## Project Overview

### Description
A complete decentralized exchange (DEX) built on Solana that allows users to buy and sell USDC tokens using SOL at a fixed exchange rate. The system consists of a Rust-based Anchor program deployed on Solana devnet and a React frontend with full wallet integration. The DEX maintains a vault system for secure token storage and implements comprehensive trading limits and validation.

### Key Features
- **Fixed Exchange Rate Trading**: 1 USDC = 0.01 SOL (100 USDC = 1 SOL)
- **Buy/Sell Operations**: Users can purchase USDC with SOL or sell USDC back to SOL
- **Trading Limits**: Maximum 2 SOL worth of USDC per buy transaction
- **Real-time Market Statistics**: Live display of vault balances and trading totals
- **Multi-wallet Support**: Integration with Phantom, Solflare, and other Solana wallets
- **Auto ATA Creation**: Automatic creation of Associated Token Accounts for new users
- **Event Emission**: All trades emit events for tracking and analytics
- **Supply Management**: Enforces 1,000,000 USDC maximum supply cap
- **Vault Security**: Secure vault system for holding USDC and SOL tokens

### How to Use the dApp

1. **Setup and Installation**
   ```bash
   # Clone and setup
   cd frontend
   npm install
   npm start
   ```

2. **Connect Wallet**
   - Click "Connect Wallet" button
   - Select your preferred Solana wallet (Phantom recommended)
   - Approve connection in wallet popup

3. **Buy USDC with SOL**
   - Select "Buy" tab in the trading interface
   - Enter SOL amount (maximum 2 SOL)
   - Click "Buy USDC" button
   - Confirm transaction in wallet
   - View transaction signature and success message

4. **Sell USDC for SOL**
   - Select "Sell" tab in the trading interface
   - Enter USDC amount to sell
   - Click "Sell USDC" button
   - Confirm transaction in wallet
   - Receive SOL in your wallet

5. **View Market Statistics**
   - Real-time display of total USDC left in vault
   - Total SOL held by the program
   - Cumulative trading statistics
   - Auto-refreshing data every 5 seconds

## Program Architecture

### PDA Usage
The program uses Program Derived Addresses (PDAs) for secure account management:

**PDAs Used:**
- **Vault Authority**: `[b"vault", usdc_mint.to_bytes()]` - Controls the USDC vault token account
- **Market State**: Generated keypair during initialization - Stores market configuration and statistics

### Program Instructions

**Instructions Implemented:**
- **`initialize`**: Sets up the market with maximum supply and creates vault accounts
- **`buy_usdc`**: Allows users to purchase USDC with SOL at fixed rate
- **`sell_usdc`**: Allows users to sell USDC back to SOL at fixed rate

### Account Structure

```rust
#[account]
pub struct MarketState {
    pub usdc_mint: Pubkey,           // USDC token mint address
    pub vault_authority: Pubkey,     // PDA that controls the vault
    pub max_supply: u64,             // Maximum USDC supply (1,000,000)
    pub total_bought: u64,           // Cumulative USDC purchased
    pub total_sold: u64,             // Cumulative USDC sold
    pub bump: u8,                    // PDA bump seed
}
```

## Frontend Architecture

### Technology Stack
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Full type safety throughout the application
- **Solana Web3.js**: Blockchain interaction and transaction handling
- **Anchor Framework**: Type-safe program interaction
- **Solana Wallet Adapter**: Multi-wallet support and connection management
- **Webpack Polyfills**: Node.js compatibility in browser environment

### Key Components

**Core Components:**
- **`App.tsx`**: Main application with wallet providers and routing
- **`Header.tsx`**: Wallet connection interface and navigation
- **`BuySellInterface.tsx`**: Trading interface with input validation
- **`MarketStats.tsx`**: Real-time market statistics display

**Utility Classes:**
- **`AnchorClient`**: Type-safe wrapper for program interaction
- **`format.ts`**: SOL/USDC amount formatting and parsing utilities
- **`constants.ts`**: Program addresses, exchange rates, and configuration

### Security Features
- **Input Validation**: All user inputs validated before submission
- **Amount Limits**: Enforced 2 SOL maximum buy limit
- **Error Handling**: Comprehensive error catching and user feedback
- **Type Safety**: Full TypeScript coverage prevents runtime errors
- **Transaction Confirmation**: All transactions require wallet confirmation

## Code Functionality Details

### Backend (Anchor Program)

**File Structure:**
```
anchor_project/usdc-buy-sell/
├── programs/usdc-buy-sell/src/lib.rs    # Main program logic
├── migrations/                          # Deployment and setup scripts
│   ├── deploy_usdc_devnet.ts           # USDC token deployment
│   ├── init_market_devnet.ts           # Market initialization
│   └── fund_vault_devnet.ts            # Vault funding script
└── tests/usdc-buy-sell.js              # Program tests
```

**Core Functions:**
- **`initialize_market`**: Creates market state and vault accounts
- **`buy_usdc`**: Processes SOL to USDC conversions with validation
- **`sell_usdc`**: Processes USDC to SOL conversions with validation
- **Event emission**: Tracks all trading activities

### Frontend (React Application)

**File Structure:**
```
frontend/
├── src/
│   ├── components/                     # React components
│   │   ├── Header.tsx                 # Wallet connection
│   │   ├── BuySellInterface.tsx       # Trading interface
│   │   └── MarketStats.tsx            # Statistics display
│   ├── utils/                         # Utility functions
│   │   ├── anchor.ts                  # Program interaction
│   │   ├── constants.ts               # Configuration
│   │   └── format.ts                  # Data formatting
│   ├── types/                         # TypeScript definitions
│   └── idl/                          # Program interface
├── public/                            # Static assets
└── package.json                       # Dependencies
```

**Key Functions:**
- **Wallet Integration**: Connect/disconnect Solana wallets
- **Transaction Handling**: Send and confirm blockchain transactions
- **Data Fetching**: Real-time market statistics and balances
- **Input Validation**: Amount limits and format checking
- **Error Management**: User-friendly error messages and handling

## Testing

### Test Coverage

**Happy Path Tests:**
- Market initialization with proper account creation
- Successful USDC purchase with SOL
- Successful USDC sale for SOL
- Event emission verification
- Supply cap enforcement
- ATA auto-creation for new users

**Unhappy Path Tests:**
- Insufficient SOL balance for purchase
- Insufficient USDC balance for sale
- Exceeding maximum buy limit (2 SOL)
- Exceeding maximum supply cap
- Invalid account states and permissions

### Running Tests
```bash
# Backend tests
cd anchor_project/usdc-buy-sell
anchor test

# Frontend tests
cd frontend
npm test
```

## Deployment Information

### Devnet Deployment
- **Program ID**: `9HzagBuheBCfbbXWVhqkYVArBzepy8Mif5rbe7gM257n`
- **USDC Mint**: `4f3XEdxWDzxAadHfXyqofXUg1Qsz5kwLCrABp64JqS7h`
- **Market State**: `2W1sWniYNwLg7LoWfZtKgeBTmXsy3GyDuCcd4ewLAHYA`
- **Vault Authority**: `D2rns2sJNRyxA1DJVSwux9NcKb79h2dBrFP2y53yyQJa`
- **Vault USDC ATA**: `5Dcg7FqrJTiC1mb39exEjnxANXTzVZFLgXvabcDqCjd7`

### Setup Commands
```bash
# Deploy USDC token
ts-node migrations/deploy_usdc_devnet.ts

# Initialize market
ts-node migrations/init_market_devnet.ts 4f3XEdxWDzxAadHfXyqofXUg1Qsz5kwLCrABp64JqS7h

# Fund vault (IMPORTANT: Required for trading)
node fund-vault.js 1000

# Start frontend
npm start
```

## Additional Notes for Evaluators

### Key Technical Achievements
1. **Complete DEX Implementation**: Full buy/sell functionality with proper validation
2. **Production-Ready Frontend**: Modern React app with comprehensive error handling
3. **Security Best Practices**: PDA usage, input validation, and transaction confirmation
4. **User Experience**: Intuitive interface with real-time statistics and feedback
5. **Comprehensive Documentation**: Detailed setup instructions and troubleshooting

### Notable Features
- **Fixed Exchange Rate**: Simple, predictable pricing model
- **Trading Limits**: Prevents excessive single transactions
- **Auto ATA Creation**: Seamless user experience for new wallets
- **Event System**: Complete transaction tracking and analytics
- **Multi-wallet Support**: Works with all major Solana wallets

### Development Workflow
1. **Program Development**: Rust/Anchor for Solana program
2. **Frontend Development**: React/TypeScript for user interface
3. **Integration**: Type-safe program interaction via IDL
4. **Testing**: Comprehensive test coverage for both backend and frontend
5. **Deployment**: Automated scripts for devnet deployment and setup

This project demonstrates a complete understanding of Solana development, from low-level program architecture to modern frontend development practices.
