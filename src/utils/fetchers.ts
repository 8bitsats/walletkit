import type { Idl } from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { makeAnchorProvider } from "@saberhq/anchor-contrib";
import { SignerWallet, SolanaProvider } from "@saberhq/solana-contrib";
import type { Connection } from "@solana/web3.js";
import { Keypair, PublicKey } from "@solana/web3.js";

export const fetchIDL = async (
  connection: Connection,
  address: string
): Promise<Idl | null> => {
  const response = await fetch(
    `https://raw.githubusercontent.com/DeployDAO/solana-program-index/master/idls/${address}.json`
  );
  if (response.status === 404) {
    return await Program.fetchIdl(
      new PublicKey(address),
      makeAnchorProvider(
        SolanaProvider.init({
          connection,
          wallet: new SignerWallet(Keypair.generate()),
        })
      )
    );
  }
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return (await response.json()) as Idl;
};
