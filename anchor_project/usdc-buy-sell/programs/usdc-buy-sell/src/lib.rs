use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

declare_id!("9HzagBuheBCfbbXWVhqkYVArBzepy8Mif5rbe7gM257n");

#[program]
pub mod usdc_buy_sell {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, max_supply: u64) -> Result<()> {
        let market_state = &mut ctx.accounts.market_state;
        market_state.usdc_mint = ctx.accounts.usdc_mint.key();
        market_state.vault_authority_bump = ctx.bumps.vault_authority;
        market_state.total_bought = 0;
        market_state.total_sold = 0;
        market_state.max_supply = max_supply;
        Ok(())
    }

    // Buy `amount` of USDC base units (e.g., 1 USDC with 6 decimals => amount = 1_000_000)
    pub fn buy_usdc(ctx: Context<BuyUsdc>, amount: u64) -> Result<()> {
        require!(amount > 0, UsdcBuySellError::InvalidAmount);

        // Ensure cap
        let market_state = &mut ctx.accounts.market_state;
        require!(
            market_state.total_bought.checked_add(amount).unwrap() <= market_state.max_supply,
            UsdcBuySellError::CapExceeded
        );

        // Ensure vault has enough USDC to sell
        require!(ctx.accounts.vault_token.amount >= amount, UsdcBuySellError::InsufficientUsdcInVault);

        // Compute lamports required: price is 0.01 SOL per 1 USDC.
        // With 9 SOL decimals and 6 USDC decimals => 10 lamports per USDC base unit.
        let required_lamports = amount
            .checked_mul(10)
            .ok_or(UsdcBuySellError::MathOverflow)?;

        // Transfer SOL from buyer to market_state account (acts as SOL vault)
        let ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.buyer.key(),
            &market_state.key(),
            required_lamports,
        );
        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                ctx.accounts.buyer.to_account_info(),
                market_state.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        // Ensure buyer ATA exists (create if missing at buyer's expense)
        if ctx.accounts.buyer_token.owner != ctx.accounts.buyer.key() {
            return err!(UsdcBuySellError::InvalidBuyerTokenAccount);
        }

        // Transfer USDC from vault to buyer ATA
        let seeds: &[&[u8]] = &[b"vault", market_state.usdc_mint.as_ref(), &[market_state.vault_authority_bump]];
        let signer = &[seeds];
        let cpi_accounts = Transfer {
            from: ctx.accounts.vault_token.to_account_info(),
            to: ctx.accounts.buyer_token.to_account_info(),
            authority: ctx.accounts.vault_authority.to_account_info(),
        };
        let cpi_ctx = CpiContext::new_with_signer(ctx.accounts.token_program.to_account_info(), cpi_accounts, signer);
        token::transfer(cpi_ctx, amount)?;

        market_state.total_bought = market_state.total_bought.checked_add(amount).unwrap();
        emit!(BuyEvent {
            buyer: ctx.accounts.buyer.key(),
            amount,
            lamports_spent: required_lamports,
        });
        Ok(())
    }

    // Sell `amount` of USDC base units back to the program for SOL
    pub fn sell_usdc(ctx: Context<SellUsdc>, amount: u64) -> Result<()> {
        require!(amount > 0, UsdcBuySellError::InvalidAmount);
        let market_state = &mut ctx.accounts.market_state;

        // Price calculation: 10 lamports per USDC base unit
        let lamports_to_receive = amount
            .checked_mul(10)
            .ok_or(UsdcBuySellError::MathOverflow)?;

        // Ensure program (state) has enough SOL
        require!(market_state.to_account_info().lamports() >= lamports_to_receive, UsdcBuySellError::InsufficientSolInVault);

        // Transfer USDC from seller to vault
        let cpi_accounts = Transfer {
            from: ctx.accounts.seller_token.to_account_info(),
            to: ctx.accounts.vault_token.to_account_info(),
            authority: ctx.accounts.seller.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        // Transfer SOL from state account to seller
        **market_state.to_account_info().try_borrow_mut_lamports()? -= lamports_to_receive;
        **ctx.accounts.seller.to_account_info().try_borrow_mut_lamports()? += lamports_to_receive;

        // track totals and cap
        require!(
            market_state.total_sold.checked_add(amount).unwrap() <= market_state.max_supply,
            UsdcBuySellError::CapExceeded
        );
        market_state.total_sold = market_state.total_sold.checked_add(amount).unwrap();

        emit!(SellEvent {
            seller: ctx.accounts.seller.key(),
            amount,
            lamports_received: lamports_to_receive,
        });
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    pub usdc_mint: Account<'info, Mint>,
    /// CHECK: PDA derived inside, no data stored
    #[account(seeds = [b"vault", usdc_mint.key().as_ref()], bump)]
    pub vault_authority: UncheckedAccount<'info>,
    #[account(
        init,
        payer = payer,
        space = 8 + MarketState::INIT_SPACE,
    )]
    pub market_state: Account<'info, MarketState>,
    #[account(
        init_if_needed,
        payer = payer,
        associated_token::mint = usdc_mint,
        associated_token::authority = vault_authority,
    )]
    pub vault_token: Account<'info, TokenAccount>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct BuyUsdc<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,
    pub usdc_mint: Account<'info, Mint>,
    #[account(
        mut,
        seeds = [b"vault", market_state.usdc_mint.as_ref()],
        bump = market_state.vault_authority_bump,
    )]
    /// CHECK: PDA signer
    pub vault_authority: UncheckedAccount<'info>,
    #[account(
        mut,
        associated_token::mint = usdc_mint,
        associated_token::authority = vault_authority,
    )]
    pub vault_token: Account<'info, TokenAccount>,
    #[account(
        init_if_needed,
        payer = buyer,
        associated_token::mint = usdc_mint,
        associated_token::authority = buyer,
    )]
    pub buyer_token: Account<'info, TokenAccount>,
    #[account(mut)]
    pub market_state: Account<'info, MarketState>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct SellUsdc<'info> {
    #[account(mut)]
    pub seller: Signer<'info>,
    pub usdc_mint: Account<'info, Mint>,
    #[account(
        mut,
        seeds = [b"vault", market_state.usdc_mint.as_ref()],
        bump = market_state.vault_authority_bump,
    )]
    /// CHECK: PDA signer
    pub vault_authority: UncheckedAccount<'info>,
    #[account(
        mut,
        associated_token::mint = usdc_mint,
        associated_token::authority = vault_authority,
    )]
    pub vault_token: Account<'info, TokenAccount>,
    #[account(
        mut,
        associated_token::mint = usdc_mint,
        associated_token::authority = seller,
    )]
    pub seller_token: Account<'info, TokenAccount>,
    #[account(mut)]
    pub market_state: Account<'info, MarketState>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct MarketState {
    pub usdc_mint: Pubkey,
    pub vault_authority_bump: u8,
    pub total_bought: u64,
    pub total_sold: u64,
    pub max_supply: u64,
}

impl MarketState {
    pub const INIT_SPACE: usize = 32 + 1 + 8 + 8 + 8;
}

#[event]
pub struct BuyEvent {
    pub buyer: Pubkey,
    pub amount: u64,
    pub lamports_spent: u64,
}

#[event]
pub struct SellEvent {
    pub seller: Pubkey,
    pub amount: u64,
    pub lamports_received: u64,
}

#[error_code]
pub enum UsdcBuySellError {
    #[msg("Amount must be greater than zero")]
    InvalidAmount,
    #[msg("Total cap exceeded")]
    CapExceeded,
    #[msg("Math overflow")]
    MathOverflow,
    #[msg("Insufficient USDC in vault")]
    InsufficientUsdcInVault,
    #[msg("Insufficient SOL in vault")]
    InsufficientSolInVault,
    #[msg("Invalid buyer token account")]
    InvalidBuyerTokenAccount,
}
