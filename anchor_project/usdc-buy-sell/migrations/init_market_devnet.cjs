const anchor = require("@coral-xyz/anchor");
const {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} = require("@solana/spl-token");

async function main() {
  const usdcMintArg = process.argv[2];
  if (!usdcMintArg) throw new Error("Provide USDC mint pubkey as arg");
  const usdcMint = new anchor.web3.PublicKey(usdcMintArg);

  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.UsdcBuySell;

  const [vaultAuthority] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), usdcMint.toBuffer()],
    program.programId
  );
  const vaultToken = getAssociatedTokenAddressSync(usdcMint, vaultAuthority, true);
  const marketState = anchor.web3.Keypair.generate();

  const maxSupply = new anchor.BN("1000000000000");

  await program.methods
    .initialize(maxSupply)
    .accounts({
      payer: provider.wallet.publicKey,
      usdcMint,
      vaultAuthority,
      vaultToken,
      marketState: marketState.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    })
    .signers([marketState])
    .rpc();

  console.log("Initialized market:");
  console.log("  Program:", program.programId.toBase58());
  console.log("  USDC Mint:", usdcMint.toBase58());
  console.log("  Market State:", marketState.publicKey.toBase58());
  console.log("  Vault Authority:", vaultAuthority.toBase58());
  console.log("  Vault ATA:", vaultToken.toBase58());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
