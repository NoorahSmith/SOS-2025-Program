USDC BUY SELL

Part 1: On-chain program (completed)
- Fixed price: 0.01 SOL per 1 USDC (10 lamports per base unit)
- Users can buy and sell USDC; events emitted on each trade
- Tracks total bought/sold; enforces 1,000,000 USDC cap
- First-time buy auto-creates buyer ATA (buyer pays fee)

Run locally
1. Install deps: `cd usdc-buy-sell && yarn`
2. Build: `anchor build`
3. Test: `anchor test`

Devnet USDC mint
1. Ensure wallet at `~/.config/solana/id.json` and airdrop SOL on devnet
2. Run: `cd usdc-buy-sell && ts-node migrations/deploy_usdc_devnet.ts`
   - Outputs USDC mint and payer ATA; mints 1,000,000 USDC to payer

Project info (Devnet)
- Program ID: 9HzagBuheBCfbbXWVhqkYVArBzepy8Mif5rbe7gM257n
- USDC Mint: 4f3XEdxWDzxAadHfXyqofXUg1Qsz5kwLCrABp64JqS7h
- Market State: 2W1sWniYNwLg7LoWfZtKgeBTmXsy3GyDuCcd4ewLAHYA
- Vault Authority: D2rns2sJNRyxA1DJVSwux9NcKb79h2dBrFP2y53yyQJa
- Vault USDC ATA: 5Dcg7FqrJTiC1mb39exEjnxANXTzVZFLgXvabcDqCjd7

Part 2: Frontend (next)
- After deploying program + USDC on devnet, build a frontend to buy/sell against SOL using the fixed rate and displaying totals/events.