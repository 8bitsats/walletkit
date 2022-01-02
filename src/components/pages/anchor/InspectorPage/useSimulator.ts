import type { Network } from "@saberhq/solana-contrib";
import { useSolana } from "@saberhq/use-solana";
import type { Message } from "@solana/web3.js";
import { Connection, Transaction } from "@solana/web3.js";
import bs58 from "bs58";
import React from "react";

import type { InstructionLogs } from "./programLogsV2";
import { parseProgramLogs } from "./programLogsV2";

const PROJECT_SERUM_RPC_ENDPOINT = "https://solana-api.projectserum.com";

const DEFAULT_SIGNATURE = bs58.encode(Buffer.alloc(64).fill(0));

const networkURLs: { [N in Network]: string } = {
  "mainnet-beta": PROJECT_SERUM_RPC_ENDPOINT,
  devnet: "https://api.devnet.solana.com/",
  testnet: "https://api.testnet.solana.com/",
  localnet: "http://localhost:8899/",
};

export const useSimulator = (message: Message) => {
  const { network } = useSolana();

  const [simulating, setSimulating] = React.useState(false);
  const [logs, setLogs] = React.useState<Array<InstructionLogs> | null>(null);
  const [error, setError] = React.useState<string>();

  const url = networkURLs[network];

  React.useEffect(() => {
    setLogs(null);
    setSimulating(false);
    setError(undefined);
  }, [network]);

  const onClick = React.useCallback(() => {
    if (simulating) return;
    setError(undefined);
    setSimulating(true);

    const connection = new Connection(url, "confirmed");
    void (async () => {
      try {
        const tx = Transaction.populate(
          message,
          new Array(message.header.numRequiredSignatures).fill(
            DEFAULT_SIGNATURE
          )
        );

        // Simulate without signers to skip signer verification
        const resp = await connection.simulateTransaction(tx, undefined, true);

        // Prettify logs
        setLogs(parseProgramLogs(resp.value.logs, resp.value.err));
      } catch (err) {
        console.error(err);
        setLogs(null);
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setSimulating(false);
      }
    })();
  }, [url, message, simulating]);
  return {
    simulate: onClick,
    simulating,
    simulationLogs: logs,
    simulationError: error,
  };
};
