const anchor = require("@coral-xyz/anchor");
const { BN } = require("@coral-xyz/anchor");
const { assert } = require("chai");
const {
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createMint,
  mintTo,
} = require("@solana/spl-token");

describe("usdc-buy-sell", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.UsdcBuySell;

  const payer = provider.wallet.payer;
  let usdcMint;
  let marketState;
  let vaultAuthorityPda;
  let vaultAuthorityBump;
  let vaultTokenAta;

  it("Initialize market and mint to vault", async () => {
    usdcMint = await createMint(
      provider.connection,
      payer,
      provider.wallet.publicKey,
      null,
      6
    );

    const [vaultAuth, bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), usdcMint.toBuffer()],
      program.programId
    );
    vaultAuthorityPda = vaultAuth;
    vaultAuthorityBump = bump;

    marketState = anchor.web3.Keypair.generate();
    vaultTokenAta = getAssociatedTokenAddressSync(usdcMint, vaultAuthorityPda, true);

    const maxSupply = new BN("1000000000000");

    await program.methods
      .initialize(maxSupply)
      .accounts({
        payer: provider.wallet.publicKey,
        usdcMint,
        vaultAuthority: vaultAuthorityPda,
        vaultToken: vaultTokenAta,
        marketState: marketState.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([marketState])
      .rpc();

    await mintTo(
      provider.connection,
      payer,
      usdcMint,
      vaultTokenAta,
      provider.wallet.publicKey,
      100n * 1_000_000n
    );
  });

  it("Buy 1 USDC", async () => {
    const buyer = provider.wallet.publicKey;
    const buyerAta = getAssociatedTokenAddressSync(usdcMint, buyer);

    const preBuyerSol = await provider.connection.getBalance(buyer);
    const preStateSol = await provider.connection.getBalance(marketState.publicKey);

    await program.methods
      .buyUsdc(new BN(1_000_000))
      .accounts({
        buyer,
        usdcMint,
        vaultAuthority: vaultAuthorityPda,
        vaultToken: vaultTokenAta,
        buyerToken: buyerAta,
        marketState: marketState.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .rpc();

    const postBuyerSol = await provider.connection.getBalance(buyer);
    const postStateSol = await provider.connection.getBalance(marketState.publicKey);
    assert.isAtLeast(postStateSol - preStateSol, 10);
    assert.isAtMost(preBuyerSol - postBuyerSol, 1_000_000); // allow some fees
  });

  it("Sell 1 USDC", async () => {
    const seller = provider.wallet.publicKey;
    const sellerAta = getAssociatedTokenAddressSync(usdcMint, seller);
    const preSellerSol = await provider.connection.getBalance(seller);
    const preStateSol = await provider.connection.getBalance(marketState.publicKey);

    await program.methods
      .sellUsdc(new BN(1_000_000))
      .accounts({
        seller,
        usdcMint,
        vaultAuthority: vaultAuthorityPda,
        vaultToken: vaultTokenAta,
        sellerToken: sellerAta,
        marketState: marketState.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    const postSellerSol = await provider.connection.getBalance(seller);
    const postStateSol = await provider.connection.getBalance(marketState.publicKey);
    assert.isAtLeast(postSellerSol - preSellerSol, 10);
    assert.isAtMost(preStateSol - postStateSol, 1_000_000);
  });
});
