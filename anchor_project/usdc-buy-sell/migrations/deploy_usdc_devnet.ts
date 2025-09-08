import { Connection, Keypair, PublicKey, clusterApiUrl } from "@solana/web3.js";
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from "@solana/spl-token";
import * as fs from "fs";

async function main() {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const secret = JSON.parse(fs.readFileSync(`${process.env.HOME}/.config/solana/id.json`, "utf8"));
  const payer = Keypair.fromSecretKey(Uint8Array.from(secret));

  const mint = await createMint(connection, payer, payer.publicKey, null, 6);
  const ata = await getOrCreateAssociatedTokenAccount(connection, payer, mint, payer.publicKey);

  const amount = 1_000_000n * 1_000_000n; // 1,000,000 USDC with 6 decimals
  await mintTo(connection, payer, mint, ata.address, payer, amount);

  console.log("USDC Mint:", mint.toBase58());
  console.log("Payer ATA:", ata.address.toBase58());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


