import * as anchor from "@coral-xyz/anchor";
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  getAccount,
  createTransferInstruction,
} from "@solana/spl-token";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

// Usage: ts-node migrations/fund_vault_devnet.ts <USDC_MINT_PUBKEY> <AMOUNT_IN_USDC>
async function main() {
  const usdcMintArg = process.argv[2];
  const amountArg = process.argv[3];
  
  if (!usdcMintArg) throw new Error("Provide USDC mint pubkey as arg");
  if (!amountArg) throw new Error("Provide amount in USDC as arg");
  
  const usdcMint = new anchor.web3.PublicKey(usdcMintArg);
  const amount = parseFloat(amountArg); // Amount in USDC (e.g., 1000 for 1000 USDC)
  const amountInBaseUnits = Math.floor(amount * Math.pow(10, 6)); // Convert to base units

  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  
  // Get the vault authority and vault token account
  const [vaultAuthority] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), usdcMint.toBuffer()],
    provider.programId
  );
  
  const vaultToken = getAssociatedTokenAddressSync(usdcMint, vaultAuthority, true);
  
  // Get the payer's USDC token account
  const payerTokenAccount = getAssociatedTokenAddressSync(
    usdcMint,
    provider.wallet.publicKey,
    false
  );

  console.log("Funding vault with USDC:");
  console.log("  USDC Mint:", usdcMint.toBase58());
  console.log("  Vault Authority:", vaultAuthority.toBase58());
  console.log("  Vault Token Account:", vaultToken.toBase58());
  console.log("  Payer Token Account:", payerTokenAccount.toBase58());
  console.log("  Amount:", amount, "USDC (", amountInBaseUnits, "base units)");

  // Check payer's USDC balance
  try {
    const payerAccount = await getAccount(connection, payerTokenAccount);
    console.log("  Payer USDC Balance:", payerAccount.amount);
    
    if (BigInt(amountInBaseUnits) > payerAccount.amount) {
      throw new Error(`Insufficient USDC balance. Have: ${payerAccount.amount}, Need: ${amountInBaseUnits}`);
    }
  } catch (error) {
    console.error("Error checking payer balance:", error);
    throw error;
  }

  // Check if vault token account exists
  try {
    const vaultAccount = await getAccount(connection, vaultToken);
    console.log("  Vault USDC Balance (before):", vaultAccount.amount);
  } catch (error) {
    console.log("  Vault token account doesn't exist yet or has no balance");
  }

  // Create transfer instruction
  const transferInstruction = createTransferInstruction(
    payerTokenAccount,
    vaultToken,
    provider.wallet.publicKey,
    amountInBaseUnits,
    [],
    TOKEN_PROGRAM_ID
  );

  // Send transaction
  const transaction = new anchor.web3.Transaction().add(transferInstruction);
  const signature = await provider.sendAndConfirm(transaction);

  console.log("✅ Successfully funded vault!");
  console.log("  Transaction signature:", signature);
  
  // Check final vault balance
  try {
    const vaultAccount = await getAccount(connection, vaultToken);
    console.log("  Vault USDC Balance (after):", vaultAccount.amount);
  } catch (error) {
    console.log("  Could not fetch final vault balance");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

