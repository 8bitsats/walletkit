import { extractErrorMessage } from "@saberhq/sail";
import { Transaction } from "@solana/web3.js";
import { useMemo } from "react";

import { Textarea } from "../../../../../common/inputs/InputText";

interface Props {
  txRaw: string;
  setTxRaw: (txRaw: string) => void;
}

export const RawTX: React.FC<Props> = ({ txRaw, setTxRaw }: Props) => {
  const { error } = useMemo(() => {
    try {
      const buffer = Buffer.from(txRaw, "base64");
      const tx = Transaction.from(buffer);
      return { tx };
    } catch (e) {
      return {
        error: extractErrorMessage(e),
      };
    }
  }, [txRaw]);

  return (
    <label tw="flex flex-col gap-1" htmlFor="instructionsRaw">
      <span tw="text-sm">Transaction (base64)</span>
      <Textarea
        id="instructionsRaw"
        tw="h-auto font-mono"
        rows={4}
        placeholder="Paste raw base64 encoded transaction message"
        value={txRaw}
        onChange={(e) => setTxRaw(e.target.value)}
      />
      <span tw="text-red-500">{error}</span>
    </label>
  );
};
