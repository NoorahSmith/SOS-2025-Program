# USDC BUY SELL - Complete Solana DEX

A complete Solana decentralized exchange (DEX) for buying and selling USDC against SOL with a fixed exchange rate.

## 🚀 Project Overview

### Part 1: On-chain Program ✅ COMPLETED
- **Fixed Exchange Rate**: 0.01 SOL per 1 USDC (10 lamports per base unit)
- **Buy/Sell Operations**: Users can buy and sell USDC with SOL
- **Event Emission**: All trades emit events for tracking
- **Supply Management**: Tracks total bought/sold; enforces 1,000,000 USDC cap
- **Auto ATA Creation**: First-time buy auto-creates buyer ATA (buyer pays fee)
- **Vault Management**: Secure vault for holding USDC and SOL

### Part 2: Frontend ✅ COMPLETED
- **React 18 + TypeScript**: Modern, type-safe frontend
- **Solana Wallet Integration**: Support for Phantom, Solflare, and other wallets
- **Buy/Sell Interface**: Intuitive trading interface with 2 SOL buy limit
- **Real-time Market Stats**: Live display of vault balances and trading totals
- **Devnet Integration**: Fully configured for Solana devnet
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 16+ and npm/yarn
- Solana CLI tools
- A Solana wallet (Phantom recommended)

### 1. Backend Setup (Anchor Program)

```bash
# Navigate to anchor project
cd usdc-buy-sell

# Install dependencies
yarn install

# Build the program
anchor build

# Run tests
anchor test
```

### 2. Deploy USDC Token on Devnet

```bash
# Ensure wallet at ~/.config/solana/id.json and airdrop SOL on devnet
solana airdrop 2

# Deploy USDC mint and mint 1,000,000 USDC to your wallet
ts-node migrations/deploy_usdc_devnet.ts
```

### 3. Initialize Market

```bash
# Initialize the market (creates accounts but doesn't fund vault)
ts-node migrations/init_market_devnet.ts 4f3XEdxWDzxAadHfXyqofXUg1Qsz5kwLCrABp64JqS7h
```

### 4. Fund the Vault ⚠️ CRITICAL STEP

**The vault must be funded with USDC before users can buy! This is essential for the DEX to function.**

#### Option 1: TypeScript Script (Anchor Project)
```bash
# Fund vault with 1000 USDC
ts-node migrations/fund_vault_devnet.ts 4f3XEdxWDzxAadHfXyqofXUg1Qsz5kwLCrABp64JqS7h 1000

# Fund vault with custom amount (e.g., 5000 USDC)
ts-node migrations/fund_vault_devnet.ts 4f3XEdxWDzxAadHfXyqofXUg1Qsz5kwLCrABp64JqS7h 5000
```

#### Option 2: JavaScript Script (Frontend Directory)
```bash
# Navigate to frontend directory
cd ../frontend

# Fund vault with 1000 USDC (default)
node fund-vault.js

# Fund vault with custom amount
node fund-vault.js 5000  # Fund with 5000 USDC
```

#### What the Fund Vault Script Does:
1. **Validates Payer Balance**: Checks you have sufficient USDC tokens
2. **Confirms Vault Exists**: Verifies vault token account is created
3. **Transfers USDC**: Moves tokens from your wallet to the program vault
4. **Provides Confirmation**: Shows transaction signature and balance updates
5. **Enables Trading**: Users can now buy USDC from the vault

#### Example Successful Output:
```
Funding vault with USDC:
  Payer: Hyx7gm7JCRZmozYjxT1LosBkjthN6J51dpufW8s14DHM
  USDC Mint: 4f3XEdxWDzxAadHfXyqofXUg1Qsz5kwLCrABp64JqS7h
  Vault Authority: D2rns2sJNRyxA1DJVSwux9NcKb79h2dBrFP2y53yyQJa
  Vault Token Account: 5Dcg7FqrJTiC1mb39exEjnxANXTzVZFLgXvabcDqCjd7
  Amount: 1000 USDC ( 1000000000 base units)
  Payer USDC Balance: 1000000000000n
  Vault USDC Balance (before): 0n
✅ Successfully funded vault!
  Transaction signature: 54UNtgGhnwMAGegnd37CuRJ9w8Lw5EaKDFMQ4EgWwmwFDwtHcqQ1tgrmMHXMqH1FJV93L9HP3gstE5m1NjxwhWqH
  Vault USDC Balance (after): 1000000000n
```

### 5. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The frontend will be available at `http://localhost:3000`

## 📊 Project Information (Devnet)

### Deployed Addresses
- **Program ID**: `9HzagBuheBCfbbXWVhqkYVArBzepy8Mif5rbe7gM257n`
- **USDC Mint**: `4f3XEdxWDzxAadHfXyqofXUg1Qsz5kwLCrABp64JqS7h`
- **Market State**: `2W1sWniYNwLg7LoWfZtKgeBTmXsy3GyDuCcd4ewLAHYA`
- **Vault Authority**: `D2rns2sJNRyxA1DJVSwux9NcKb79h2dBrFP2y53yyQJa`
- **Vault USDC ATA**: `5Dcg7FqrJTiC1mb39exEjnxANXTzVZFLgXvabcDqCjd7`

### Exchange Rate
- **1 USDC = 0.01 SOL**
- **1 SOL = 100 USDC**
- **Buy Limit**: Maximum 2 SOL worth of USDC per transaction

## 🎯 Frontend Features

### Core Functionality
- ✅ **Wallet Connection**: Connect with Phantom, Solflare, or other Solana wallets
- ✅ **Buy USDC**: Purchase USDC with SOL (up to 2 SOL limit)
- ✅ **Sell USDC**: Sell USDC back to SOL
- ✅ **Real-time Stats**: Live market statistics display
- ✅ **Transaction History**: View transaction signatures and status
- ✅ **Error Handling**: Comprehensive error messages and validation

### Market Statistics Display
- **Total USDC Left**: Available USDC in the vault
- **Total SOL in Program**: SOL held by the program
- **Total Bought**: Cumulative USDC purchased
- **Total Sold**: Cumulative USDC sold

### User Interface
- **Responsive Design**: Works on all screen sizes
- **Intuitive Controls**: Easy-to-use buy/sell interface
- **Real-time Updates**: Statistics refresh automatically
- **Transaction Feedback**: Clear success/error messages

## 🔧 Technical Architecture

### Frontend Stack
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Full type safety throughout the application
- **Solana Web3.js**: Solana blockchain interaction
- **Anchor Framework**: Program interaction and type safety
- **Solana Wallet Adapter**: Multi-wallet support
- **Webpack Polyfills**: Node.js compatibility in browser

### Key Components
- **App.tsx**: Main application with wallet providers
- **Header.tsx**: Wallet connection and navigation
- **BuySellInterface.tsx**: Trading interface with validation
- **MarketStats.tsx**: Real-time market statistics
- **AnchorClient**: Type-safe program interaction wrapper

### Security Features
- **Input Validation**: All user inputs are validated
- **Amount Limits**: Enforced 2 SOL buy limit
- **Error Handling**: Comprehensive error catching and reporting
- **Type Safety**: Full TypeScript coverage prevents runtime errors

## 🏦 Vault Management & Funding

### Understanding the Vault System

The USDC Buy/Sell DEX uses a vault system to hold USDC tokens that users can purchase with SOL. The vault must be funded before any trading can occur.

#### Vault Architecture
- **Vault Authority**: PDA that controls the vault (`D2rns2sJNRyxA1DJVSwux9NcKb79h2dBrFP2y53yyQJa`)
- **Vault Token Account**: Associated Token Account holding USDC (`5Dcg7FqrJTiC1mb39exEjnxANXTzVZFLgXvabcDqCjd7`)
- **USDC Mint**: The token mint for USDC (`4f3XEdxWDzxAadHfXyqofXUg1Qsz5kwLCrABp64JqS7h`)

#### Fund Vault Scripts

**TypeScript Version** (`migrations/fund_vault_devnet.ts`):
```bash
# Fund with 1000 USDC
ts-node migrations/fund_vault_devnet.ts 4f3XEdxWDzxAadHfXyqofXUg1Qsz5kwLCrABp64JqS7h 1000

# Fund with custom amount
ts-node migrations/fund_vault_devnet.ts 4f3XEdxWDzxAadHfXyqofXUg1Qsz5kwLCrABp64JqS7h 5000
```

**JavaScript Version** (`frontend/fund-vault.js`):
```bash
cd frontend
node fund-vault.js 1000  # Fund with 1000 USDC
```

#### Fund Vault Process
1. **Balance Check**: Verifies payer has sufficient USDC tokens
2. **Vault Validation**: Confirms vault token account exists
3. **Token Transfer**: Moves USDC from payer to vault
4. **Transaction Confirmation**: Provides signature and balance updates
5. **Trading Enablement**: Users can now buy USDC from the vault

#### Prerequisites for Vault Funding
- ✅ **USDC Tokens**: Must have USDC in your wallet (from `deploy_usdc_devnet.ts`)
- ✅ **SOL for Fees**: Sufficient SOL for transaction fees
- ✅ **Market Initialized**: Market must be initialized first
- ✅ **Devnet Connection**: Must be connected to Solana devnet

## 🚨 Troubleshooting

### Common Issues

#### 1. "Insufficient USDC in vault" Error
**Problem**: The vault hasn't been funded with USDC tokens.
**Solution**: Run the funding script:
```bash
cd frontend
node fund-vault.js 1000  # Fund with 1000 USDC
```

#### 2. "Account does not exist" Error
**Problem**: Market not initialized or wrong addresses.
**Solution**: Ensure market is initialized and using correct addresses from this README.

#### 3. Wallet Connection Issues
**Problem**: Wallet not connecting or transactions failing.
**Solution**: 
- Ensure you're on Solana devnet
- Check wallet has sufficient SOL for transaction fees
- Try refreshing the page and reconnecting wallet

#### 4. Build Errors
**Problem**: Frontend won't start due to missing dependencies.
**Solution**:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

#### 5. Vault Funding Issues
**Problem**: "Insufficient USDC balance" when funding vault.
**Solution**: 
- Run `deploy_usdc_devnet.ts` to mint USDC tokens to your wallet
- Ensure you have at least the amount you're trying to fund

**Problem**: "Vault token account doesn't exist"
**Solution**:
- Initialize the market first using `init_market_devnet.ts`
- The vault token account is created during market initialization

**Problem**: "Transaction failed" during vault funding
**Solution**:
- Check you have sufficient SOL for transaction fees
- Ensure you're connected to devnet
- Verify your wallet is unlocked

### Debug Information
The frontend includes comprehensive logging. Check browser console for:
- Vault balance information
- Transaction amounts and details
- Market state data
- Error messages with full context
- Wallet connection status
- Fund vault transaction details

## 📁 Project Structure

```
program-NoorahSmith/
├── anchor_project/
│   └── usdc-buy-sell/           # Anchor program
│       ├── programs/            # Rust program code
│       ├── migrations/          # Deployment scripts
│       └── tests/               # Program tests
└── frontend/                    # React frontend
    ├── src/
    │   ├── components/          # React components
    │   ├── utils/               # Utility functions
    │   ├── types/               # TypeScript types
    │   └── idl/                 # Program IDL
    ├── public/                  # Static assets
    └── package.json             # Dependencies
```

## 🔄 Development Workflow

1. **Make changes to Rust program** → `anchor build` → `anchor test`
2. **Deploy to devnet** → `anchor deploy`
3. **Update frontend constants** if addresses change
4. **Test frontend** → `npm start`
5. **Fund vault** if needed → `node fund-vault.js [amount]`

## 📝 Next Steps

- [ ] Add more wallet support
- [ ] Implement order book functionality
- [ ] Add price charts and analytics
- [ ] Deploy to mainnet
- [ ] Add liquidity provider rewards
- [ ] Implement advanced trading features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on devnet
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.