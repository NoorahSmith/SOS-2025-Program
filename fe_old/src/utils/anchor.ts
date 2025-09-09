import { Program, AnchorProvider, BN } from '@coral-xyz/anchor';
import { Connection, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import { WalletAdapter } from '@solana/wallet-adapter-base';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync } from '@solana/spl-token';
import { Buffer } from 'buffer';
import { PROGRAM_ID, MARKET_STATE_ADDRESS, MARKET_STATE_SEED, VAULT_AUTHORITY_ADDRESS, VAULT_TOKEN_ADDRESS, VAULT_SEED, LAMPORTS_PER_USDC_UNIT, USDC_MINT } from './constants';
import { MarketState } from '../types';
import idl from '../idl/usdc_buy_sell.json';

// Make Buffer available globally
if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
}

export class AnchorClient {
  private program: Program;
  private connection: Connection;
  private wallet: WalletAdapter;

  constructor(connection: Connection, wallet: WalletAdapter) {
    this.connection = connection;
    this.wallet = wallet;
    
    const provider = new AnchorProvider(
      connection,
      wallet as any,
      { preflightCommitment: 'processed' }
    );
    
    this.program = new Program(idl as any, provider);
  }

  async getMarketState(): Promise<MarketState | null> {
    try {
      const marketState = await (this.program.account as any).marketState.fetch(MARKET_STATE_ADDRESS);
      return marketState as MarketState;
    } catch (error) {
      console.error('Error fetching market state:', error);
      return null;
    }
  }

  async initializeMarket(maxSupply: number): Promise<string> {
    if (!this.wallet.publicKey) throw new Error('Wallet not connected');

    const [marketStatePDA] = PublicKey.findProgramAddressSync(
      [Buffer.from(MARKET_STATE_SEED)],
      PROGRAM_ID
    );

    const [vaultAuthorityPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from(VAULT_SEED), USDC_MINT.toBuffer()],
      PROGRAM_ID
    );

    const vaultTokenPDA = getAssociatedTokenAddressSync(
      USDC_MINT,
      vaultAuthorityPDA,
      true,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const tx = await this.program.methods
      .initialize(new BN(maxSupply))
      .accounts({
        payer: this.wallet.publicKey,
        usdcMint: USDC_MINT,
        vaultAuthority: vaultAuthorityPDA,
        marketState: marketStatePDA,
        vaultToken: vaultTokenPDA,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .rpc();

    return tx;
  }

  async getMarketStats(): Promise<{
    totalUSDCLeft: number;
    totalSOLInProgram: number;
    totalBought: number;
    totalSold: number;
    maxSupply: number;
  } | null> {
    try {
      const marketState = await this.getMarketState();
      if (!marketState) return null;

      const accountInfo = await this.connection.getAccountInfo(MARKET_STATE_ADDRESS);
      const totalSOLInProgram = accountInfo?.lamports || 0;

      // Get USDC left in vault using the actual vault token address
      const vaultTokenAccount = await this.connection.getTokenAccountBalance(VAULT_TOKEN_ADDRESS);
      const totalUSDCLeft = parseInt(vaultTokenAccount.value.amount);
      
      console.log('Vault token account info:', {
        address: VAULT_TOKEN_ADDRESS.toString(),
        amount: vaultTokenAccount.value.amount,
        uiAmount: vaultTokenAccount.value.uiAmount,
        decimals: vaultTokenAccount.value.decimals
      });

      return {
        totalUSDCLeft,
        totalSOLInProgram,
        totalBought: marketState.totalBought,
        totalSold: marketState.totalSold,
        maxSupply: marketState.maxSupply,
      };
    } catch (error) {
      console.error('Error fetching market stats:', error);
      return null;
    }
  }

  async buyUSDC(amount: number): Promise<string> {
    if (!this.wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    const marketState = await this.getMarketState();
    if (!marketState) {
      throw new Error('Market not initialized');
    }

    console.log('Buy USDC - Amount requested:', amount);
    console.log('Market state:', marketState);

    // Use the actual deployed addresses
    const marketStatePDA = MARKET_STATE_ADDRESS;
    const vaultAuthorityPDA = VAULT_AUTHORITY_ADDRESS;
    const vaultTokenPDA = VAULT_TOKEN_ADDRESS;

    const [buyerTokenPDA] = PublicKey.findProgramAddressSync(
      [
        this.wallet.publicKey.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        marketState.usdcMint.toBuffer(),
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const tx = await this.program.methods
      .buyUsdc(new BN(amount))
      .accounts({
        buyer: this.wallet.publicKey,
        usdcMint: marketState.usdcMint,
        vaultAuthority: vaultAuthorityPDA,
        vaultToken: vaultTokenPDA,
        buyerToken: buyerTokenPDA,
        marketState: marketStatePDA,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .rpc();

    return tx;
  }

  async sellUSDC(amount: number): Promise<string> {
    if (!this.wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    const marketState = await this.getMarketState();
    if (!marketState) {
      throw new Error('Market not initialized');
    }

    // Use the actual deployed addresses
    const marketStatePDA = MARKET_STATE_ADDRESS;
    const vaultAuthorityPDA = VAULT_AUTHORITY_ADDRESS;
    const vaultTokenPDA = VAULT_TOKEN_ADDRESS;

    const [sellerTokenPDA] = PublicKey.findProgramAddressSync(
      [
        this.wallet.publicKey.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        marketState.usdcMint.toBuffer(),
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const tx = await this.program.methods
      .sellUsdc(new BN(amount))
      .accounts({
        seller: this.wallet.publicKey,
        usdcMint: marketState.usdcMint,
        vaultAuthority: vaultAuthorityPDA,
        vaultToken: vaultTokenPDA,
        sellerToken: sellerTokenPDA,
        marketState: marketStatePDA,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    return tx;
  }
}

