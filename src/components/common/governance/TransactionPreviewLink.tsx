import { SolanaProvider, TransactionEnvelope } from "@saberhq/solana-contrib";
import { useSolana } from "@saberhq/use-solana";
import { PublicKey } from "@solana/web3.js";
import type { ProposalInstruction } from "@tribecahq/tribeca-sdk";
import { useMemo } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";

interface Props {
  instructions: ProposalInstruction[];
}

export const TransactionPreviewLink: React.FC<Props> = ({
  instructions,
}: Props) => {
  const { provider, providerMut, network } = useSolana();
  const txEnv = useMemo(() => {
    return new TransactionEnvelope(
      providerMut ??
        SolanaProvider.load({
          connection: provider.connection,
          sendConnection: provider.connection,
          wallet: {
            publicKey:
              network === "devnet"
                ? new PublicKey("A2jaCHPzD6346348JoEym2KFGX9A7uRBw6AhCdX7gTWP")
                : new PublicKey("9u9iZBWqGsp5hXBxkVZtBTuLSGNAG9gEQLgpuVw39ASg"),
            signTransaction: () => {
              throw new Error("unimplemented");
            },
            signAllTransactions: () => {
              throw new Error("unimplemented");
            },
          },
        }),
      instructions.map((ix) => ({
        ...ix,
        data: Buffer.from(ix.data),
      }))
    );
  }, [instructions, network, provider.connection, providerMut]);

  if (!(txEnv && network !== "localnet")) {
    return <></>;
  }

  return (
    <a
      tw="text-sm flex items-center gap-2 text-primary"
      href={txEnv.generateInspectLink(network)}
      target="_blank"
      rel="noreferrer"
    >
      Preview on Solana Explorer
      <FaExternalLinkAlt />
    </a>
  );
};
