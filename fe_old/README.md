# USDC Buy/Sell DEX Frontend

A modern React frontend for the USDC Buy/Sell Solana program, providing an intuitive interface for trading USDC with SOL on the Solana blockchain. This is a complete decentralized exchange (DEX) frontend with comprehensive wallet integration and real-time market data.

## 🚀 Features

### Core Trading Functionality
- **Buy USDC**: Exchange SOL for USDC at a fixed rate of 0.01 SOL per USDC
- **Sell USDC**: Exchange USDC back to SOL at the same rate
- **Transaction Limits**: Maximum 2 SOL per buy transaction to prevent large trades
- **Real-time Validation**: Input validation with balance checks and error handling
- **Auto ATA Creation**: Automatic creation of Associated Token Accounts for new users

### 📊 Market Statistics & Analytics
- **Live Market Data**: Real-time display of market statistics (updates every 5 seconds)
- **USDC Availability**: Shows total USDC remaining in the program vault
- **SOL Reserves**: Displays total SOL held by the program
- **Trading Volume**: Shows total bought and sold amounts
- **Market Utilization**: Percentage of max supply used
- **Vault Balance**: Real-time vault token account information

### 🔗 Advanced Wallet Integration
- **Multi-Wallet Support**: Compatible with Phantom, Solflare, and other Solana wallets
- **Auto-Connect**: Automatic wallet reconnection on page load
- **Balance Display**: Real-time SOL and USDC balance updates
- **Transaction History**: Transaction signatures logged to console
- **Network Detection**: Automatic devnet connection and validation

### 🎨 Modern User Experience
- **Responsive Design**: Optimized for desktop and mobile devices
- **Loading States**: Visual feedback during transaction processing
- **Error Handling**: Clear error messages and validation feedback
- **Success Notifications**: Confirmation messages for successful transactions
- **Debug Information**: Comprehensive logging for troubleshooting

### 🛠️ Vault Management Tools
- **Fund Vault Script**: JavaScript utility to fund the vault with USDC tokens
- **Balance Monitoring**: Real-time vault balance tracking
- **Transaction Verification**: Complete transaction signature logging

## Technology Stack

- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development with full type coverage
- **Solana Web3.js**: Solana blockchain interaction
- **Anchor Framework**: Program interaction and transaction building
- **Wallet Adapter**: Multi-wallet support and connection management
- **Lucide React**: Modern icon library for UI elements
- **CSS3**: Custom styling with gradients and animations

## Project Structure

```
frontend/
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── components/             # React components
│   │   ├── Header.tsx         # Navigation and wallet connection
│   │   ├── MarketStats.tsx    # Market statistics display
│   │   ├── BuySellInterface.tsx # Main trading interface
│   │   └── *.css              # Component-specific styles
│   ├── utils/                  # Utility functions
│   │   ├── anchor.ts          # Anchor client wrapper
│   │   ├── constants.ts       # Program constants and configuration
│   │   └── format.ts          # Number formatting utilities
│   ├── types/                  # TypeScript type definitions
│   │   └── index.ts           # Shared types and interfaces
│   ├── App.tsx                # Main application component
│   ├── App.css                # Global application styles
│   ├── index.tsx              # Application entry point
│   └── index.css              # Global styles
├── package.json               # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── README.md                 # This documentation
```

## Installation & Setup

### Prerequisites
- Node.js 16+ and npm/yarn
- Solana wallet (Phantom, Solflare, etc.)
- Access to Solana Devnet

### Installation Steps

1. **Navigate to the frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## Configuration

### Program Configuration
The frontend is configured to work with the deployed USDC Buy/Sell program:

- **Program ID**: `9HzagBuheBCfbbXWVhqkYVArBzepy8Mif5rbe7gM257n`
- **Network**: Solana Devnet
- **USDC Mint**: `4f3XEdxWDzxAadHfXyqofXUg1Qsz5kwLCrABp64JqS7h`
- **Market State**: `2W1sWniYNwLg7LoWfZtKgeBTmXsy3GyDuCcd4ewLAHYA`
- **Vault Authority**: `D2rns2sJNRyxA1DJVSwux9NcKb79h2dBrFP2y53yyQJa`
- **Vault USDC ATA**: `5Dcg7FqrJTiC1mb39exEjnxANXTzVZFLgXvabcDqCjd7`

### Constants
Key configuration values in `src/utils/constants.ts`:

```typescript
export const PROGRAM_ID = new PublicKey("9HzagBuheBCfbbXWVhqkYVArBzepy8Mif5rbe7gM257n");
export const USDC_MINT = new PublicKey("4f3XEdxWDzxAadHfXyqofXUg1Qsz5kwLCrABp64JqS7h");
export const MARKET_STATE_ADDRESS = new PublicKey("2W1sWniYNwLg7LoWfZtKgeBTmXsy3GyDuCcd4ewLAHYA");
export const VAULT_AUTHORITY_ADDRESS = new PublicKey("D2rns2sJNRyxA1DJVSwux9NcKb79h2dBrFP2y53yyQJa");
export const VAULT_TOKEN_ADDRESS = new PublicKey("5Dcg7FqrJTiC1mb39exEjnxANXTzVZFLgXvabcDqCjd7");
export const MAX_SOL_AMOUNT = 2 * 1e9; // 2 SOL in lamports
export const LAMPORTS_PER_USDC_UNIT = 0.01 * 1e9; // 0.01 SOL per USDC
```

## Usage Guide

### Connecting Your Wallet
1. Click the "Select Wallet" button in the header
2. Choose your preferred wallet (Phantom, Solflare, etc.)
3. Approve the connection in your wallet
4. Your wallet address and balances will be displayed

### Buying USDC
1. Ensure you have SOL in your wallet
2. Click the "Buy USDC" tab
3. Enter the amount of SOL you want to spend (max 2 SOL)
4. Click "Buy USDC" and approve the transaction
5. USDC will be added to your wallet

### Selling USDC
1. Ensure you have USDC in your wallet
2. Click the "Sell USDC" tab
3. Enter the amount of USDC you want to sell
4. Click "Sell USDC" and approve the transaction
5. SOL will be added to your wallet

### Viewing Market Statistics
The market statistics panel shows:
- **USDC Available**: Remaining USDC in the program vault
- **SOL in Program**: Total SOL held by the program
- **Total Bought**: Cumulative USDC purchased
- **Total Sold**: Cumulative USDC sold back
- **Market Utilization**: Percentage of max supply used

## 🏦 Vault Management

### Fund Vault Functionality

The vault must be funded with USDC tokens before users can buy USDC. The frontend includes a utility script to fund the vault.

#### Fund Vault Script (`fund-vault.js`)

**Purpose**: Transfer USDC tokens from your wallet to the program vault to enable trading.

**Usage**:
```bash
# Fund vault with 1000 USDC (default)
node fund-vault.js

# Fund vault with custom amount
node fund-vault.js 5000  # Fund with 5000 USDC
```

**What the script does**:
1. **Checks Payer Balance**: Verifies you have sufficient USDC tokens
2. **Validates Vault**: Confirms vault token account exists
3. **Transfers Tokens**: Moves USDC from your wallet to the vault
4. **Confirms Transaction**: Provides transaction signature
5. **Shows Results**: Displays before/after vault balances

**Example Output**:
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

#### Prerequisites for Funding
1. **USDC Tokens**: You must have USDC tokens in your wallet (minted by `deploy_usdc_devnet.ts`)
2. **SOL for Fees**: Sufficient SOL for transaction fees
3. **Market Initialized**: The market must be initialized first

#### Troubleshooting Vault Funding

**Error: "Insufficient USDC balance"**
- Solution: Ensure you have USDC tokens in your wallet
- Run `deploy_usdc_devnet.ts` to mint USDC tokens

**Error: "Vault token account doesn't exist"**
- Solution: Initialize the market first using `init_market_devnet.ts`

**Error: "Transaction failed"**
- Solution: Check you have sufficient SOL for transaction fees
- Ensure you're connected to devnet

### Vault Monitoring

The frontend provides real-time vault monitoring:

- **Balance Tracking**: Live updates of vault USDC balance
- **Transaction Logging**: All vault transactions are logged
- **Error Detection**: Automatic detection of insufficient vault funds
- **Debug Information**: Comprehensive vault state information in console

## API Reference

### AnchorClient Class

The `AnchorClient` class provides methods for interacting with the Solana program:

#### `getMarketState(): Promise<MarketState | null>`
Fetches the current market state from the blockchain.

#### `getMarketStats(): Promise<MarketStats | null>`
Retrieves comprehensive market statistics including balances and trading volumes.

#### `buyUSDC(amount: number): Promise<string>`
Executes a buy transaction for the specified USDC amount.
- `amount`: USDC amount in base units (6 decimals)

#### `sellUSDC(amount: number): Promise<string>`
Executes a sell transaction for the specified USDC amount.
- `amount`: USDC amount in base units (6 decimals)

### Utility Functions

#### Formatting Functions
- `formatSOL(lamports: number): string` - Format lamports as SOL
- `formatUSDC(amount: number): string` - Format USDC base units as USDC
- `parseSOL(sol: string): number` - Parse SOL string to lamports
- `parseUSDC(usdc: string): number` - Parse USDC string to base units

## Error Handling

The application includes comprehensive error handling:

### Validation Errors
- **Amount Required**: User must enter a valid amount
- **Insufficient Balance**: Not enough SOL/USDC for the transaction
- **Maximum Limit**: Buy transactions cannot exceed 2 SOL
- **Invalid Input**: Non-numeric or negative values

### Transaction Errors
- **Wallet Not Connected**: User must connect wallet before trading
- **Program Errors**: Handles all program-specific error codes
- **Network Errors**: Connection and RPC call failures
- **User Rejection**: Transaction cancelled by user

### Error Display
- Clear, user-friendly error messages
- Visual indicators (red borders, error icons)
- Automatic error clearing on input change
- Console logging for debugging

## Security Considerations

### Client-Side Security
- **Input Validation**: All user inputs are validated before submission
- **Balance Checks**: Real-time balance verification
- **Transaction Limits**: Enforced maximum transaction amounts
- **Error Handling**: Comprehensive error catching and display

### Wallet Security
- **No Private Key Storage**: Private keys never leave the user's wallet
- **User Approval**: All transactions require explicit user approval
- **Transaction Signing**: All transactions are signed by the user's wallet

## Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Code Style
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with React-specific rules
- **Prettier**: Code formatting (if configured)
- **Functional Components**: Modern React patterns with hooks

### Adding New Features
1. Create new components in `src/components/`
2. Add utility functions in `src/utils/`
3. Define types in `src/types/`
4. Update documentation as needed

## Troubleshooting

### Common Issues

#### "Insufficient USDC in vault" Error
**Problem**: The vault hasn't been funded with USDC tokens.
**Solution**: 
```bash
# Fund the vault with USDC tokens
node fund-vault.js 1000  # Fund with 1000 USDC
```

#### Wallet Connection Problems
- Ensure wallet extension is installed and unlocked
- Try refreshing the page
- Check if wallet is connected to Devnet
- Verify wallet has sufficient SOL for transaction fees

#### Transaction Failures
- Verify sufficient balance for transaction + fees
- Check network connection
- Ensure program is deployed and initialized
- Confirm vault is funded with USDC tokens

#### "Account does not exist" Error
**Problem**: Market not initialized or wrong addresses.
**Solution**: 
- Ensure market is initialized using `init_market_devnet.ts`
- Verify using correct addresses from this README
- Check program is deployed to devnet

#### Build Errors
- Clear node_modules and reinstall dependencies
- Check TypeScript configuration
- Verify all imports are correct
- Ensure IDL file is in correct location

#### Vault Funding Issues
- **"Insufficient USDC balance"**: Run `deploy_usdc_devnet.ts` to mint USDC tokens
- **"Vault token account doesn't exist"**: Initialize market first
- **"Transaction failed"**: Check SOL balance for fees and devnet connection

### Debug Mode
Enable debug logging by opening browser developer tools and checking the console for:
- Vault balance information
- Transaction amounts and details
- Market state data
- Error messages with full context
- Wallet connection status

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is part of the USDC Buy/Sell Solana program and follows the same licensing terms.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review the console for error messages
3. Ensure all prerequisites are met
4. Contact the development team

---

**Note**: This frontend is designed for the Solana Devnet. For mainnet deployment, update the network configuration and program addresses accordingly.