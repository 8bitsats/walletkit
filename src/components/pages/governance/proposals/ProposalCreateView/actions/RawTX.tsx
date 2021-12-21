import { extractErrorMessage } from "@saberhq/sail";
import { Transaction } from "@solana/web3.js";

import { HelperCard } from "../../../../../common/HelperCard";
import { Textarea } from "../../../../../common/inputs/InputText";

interface Props {
  setError: (err: string | null) => void;
  txRaw: string;
  setTxRaw: (txRaw: string) => void;
}

export const RawTX: React.FC<Props> = ({
  setError,
  txRaw,
  setTxRaw,
}: Props) => {
  return (
    <>
      <HelperCard variant="muted">
        <div tw="prose prose-sm prose-light">
          <p>
            This page allows proposing any arbitrary transaction for execution
            by the DAO. The fee payer and recent blockhash will not be used.
          </p>
          <p>
            This page is intended to be only be used by developers. Docs are
            coming soon.
          </p>
        </div>
      </HelperCard>
      <label tw="flex flex-col gap-1" htmlFor="instructionsRaw">
        <span tw="text-sm">Transaction (base64)</span>
        <Textarea
          id="instructionsRaw"
          tw="h-auto font-mono"
          rows={4}
          placeholder="Paste raw base64 encoded transaction message"
          value={txRaw}
          onChange={(e) => {
            setTxRaw(e.target.value);
            try {
              const buffer = Buffer.from(e.target.value, "base64");
              const tx = Transaction.from(buffer);
              if (tx.instructions.length === 0) {
                throw new Error("no instruction data");
              }
              setError(null);
            } catch (err) {
              setError(
                `Invalid transaction data: ${
                  extractErrorMessage(err) ?? "(unknown)"
                }`
              );
            }
          }}
        />
      </label>
    </>
  );
};
