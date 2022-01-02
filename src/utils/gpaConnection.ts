import type { Network } from "@saberhq/solana-contrib";
import { Connection } from "@solana/web3.js";

const PROJECT_SERUM_RPC_ENDPOINT = "https://solana-api.projectserum.com";
const DEVNET_ENDPOINT = "https://api.devnet.solana.com";

export const getGPAConnection = ({
  connection,
  network,
}: {
  connection?: Connection;
  network?: Network;
}): Connection => {
  if (!connection) {
    return new Connection(
      network === "devnet" ? DEVNET_ENDPOINT : PROJECT_SERUM_RPC_ENDPOINT
    );
  }
  return network === "mainnet-beta"
    ? new Connection(PROJECT_SERUM_RPC_ENDPOINT)
    : connection;
};
