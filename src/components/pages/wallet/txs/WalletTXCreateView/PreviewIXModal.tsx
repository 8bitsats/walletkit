import type { SmartWalletWrapper } from "@gokiprotocol/client";
import type { InstructionDisplay } from "@project-serum/anchor/dist/cjs/coder/instruction";
import { useSail } from "@saberhq/sail";
import {
  SignerWallet,
  SingleConnectionBroadcaster,
  SolanaProvider,
  TransactionEnvelope,
} from "@saberhq/solana-contrib";
import { useSolana } from "@saberhq/use-solana";
import type {
  SimulatedTransactionResponse,
  TransactionInstruction,
} from "@solana/web3.js";
import { Connection, Keypair, Transaction } from "@solana/web3.js";
import { startCase } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import invariant from "tiny-invariant";

import { AsyncButton } from "../../../../common/AsyncButton";
import { AttributeList } from "../../../../common/AttributeList";
import { Modal } from "../../../../common/Modal";
import type { InstructionInfo } from ".";

interface Props {
  ix: InstructionInfo;
  txInstructions: TransactionInstruction[];
  formatted: InstructionDisplay;
  isOpen: boolean;
  onDismiss: () => void;
  smartWallet?: SmartWalletWrapper | null;
}

export const PreviewIXModal: React.FC<Props> = ({
  ix,
  txInstructions,
  formatted,
  isOpen,
  smartWallet,
  onDismiss,
}: Props) => {
  const { network } = useSolana();
  const { handleTX } = useSail();

  // TODO(michael): Figure this out ...
  const rpcURL = process.env.RPC_URL ?? "https://api.devnet.solana.com";
  const readonlyKeypair = Keypair.generate();

  const txEnv = useMemo(() => {
    const theTX = new Transaction();
    theTX.instructions = txInstructions;
    theTX.feePayer =
      smartWallet?.provider.wallet.publicKey ?? readonlyKeypair.publicKey;
    const readonlyConnection = new Connection(rpcURL);

    return new TransactionEnvelope(
      smartWallet?.provider ??
        new SolanaProvider(
          readonlyConnection,
          new SingleConnectionBroadcaster(readonlyConnection),
          new SignerWallet(readonlyKeypair)
        ),
      txInstructions
    );
  }, [smartWallet, txInstructions, rpcURL, readonlyKeypair]);
  const [result, setResult] = useState<SimulatedTransactionResponse | null>(
    null
  );
  useEffect(() => {
    if (!txEnv) {
      return;
    }
    void (async () => {
      const theTX = txEnv.build();
      theTX.feePayer = txEnv.provider.wallet.publicKey;
      const simResult = await txEnv.provider.connection.simulateTransaction(
        theTX,
        undefined
      );
      setResult(simResult.value);
    })();

    return () => {
      setResult(null);
    };
  }, [txEnv]);

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <div tw="flex flex-col gap-6">
        <h2 tw="font-semibold">Preview: {startCase(ix.instruction.name)}</h2>
        {formatted.args.length > 0 && (
          <div tw="grid gap-4">
            <h3 tw="font-semibold">Arguments</h3>
            <AttributeList
              attributes={formatted.args.reduce(
                (acc, el) => ({
                  ...acc,
                  [`${el.name} (${el.type})`]: el.data,
                }),
                {}
              )}
            />
          </div>
        )}
        <div tw="grid gap-4">
          <h3 tw="font-semibold">Accounts</h3>
          <AttributeList
            attributes={formatted.accounts.reduce(
              (acc, el) => ({
                ...acc,
                [el.name ?? el.pubkey.toString()]: el.pubkey,
              }),
              {}
            )}
          />
        </div>
        <div>
          <h3 tw="font-semibold flex items-center gap-1">
            Simulated Output
            {result?.err && (
              <span tw="bg-red-500 px-1 py-0.5 rounded text-white text-xs">
                error
              </span>
            )}
          </h3>
          <div tw="relative w-full max-w-full font-mono">
            <div tw="w-full max-w-full overflow-x-scroll text-xs whitespace-pre">
              {result?.logs?.join("\n")}
            </div>
          </div>
          {network !== "localnet" && (
            <a
              tw="flex items-center text-primary gap-2"
              target="_blank"
              href={txEnv?.generateInspectLink(network) ?? ""}
              rel="noreferrer"
            >
              View on Solana Explorer <FaExternalLinkAlt />
            </a>
          )}
        </div>
        <div>
          {smartWallet && (
            <AsyncButton
              onClick={async () => {
                invariant(smartWallet, "smart wallet");
                const pendingTX = await smartWallet.newTransaction({
                  instructions: txInstructions,
                });
                await handleTX(
                  pendingTX.tx,
                  `Propose ${startCase(ix.instruction.name)}`
                );
                onDismiss();
              }}
            >
              Propose Transaction
            </AsyncButton>
          )}
        </div>
      </div>
    </Modal>
  );
};
