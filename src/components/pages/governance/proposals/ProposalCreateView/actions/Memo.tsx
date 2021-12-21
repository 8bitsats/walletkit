import {
  buildStubbedTransaction,
  createMemoInstruction,
} from "@saberhq/solana-contrib";
import { useState } from "react";
import invariant from "tiny-invariant";

import { serializeToBase64 } from "../../../../../../utils/makeTransaction";
import { HelperCard } from "../../../../../common/HelperCard";
import { Textarea } from "../../../../../common/inputs/InputText";
import { useGovernor } from "../../../hooks/useGovernor";

interface Props {
  setError: (err: string | null) => void;
  setTxRaw: (txRaw: string) => void;
}

export const Memo: React.FC<Props> = ({ setError, setTxRaw }: Props) => {
  const [memo, setMemo] = useState<string>("");
  const { smartWallet } = useGovernor();

  return (
    <>
      <HelperCard>
        A memo allows a DAO to attest a message on chain. Memo actions may be
        used to create proposals that don't have any on-chain actions.
      </HelperCard>
      <label tw="flex flex-col gap-1" htmlFor="memo">
        <span tw="text-sm">Memo</span>
        <Textarea
          id="memo"
          tw="h-auto"
          rows={4}
          placeholder="The memo for the DAO to send."
          value={memo}
          disabled={!smartWallet}
          onChange={(e) => {
            invariant(smartWallet);
            setMemo(e.target.value);
            try {
              const txStub = buildStubbedTransaction("devnet", [
                createMemoInstruction(e.target.value, [smartWallet]),
              ]);
              setTxRaw(serializeToBase64(txStub));
              setError(null);
            } catch (ex) {
              setTxRaw("");
              console.debug("Error creating memo", ex);
              setError("Memo is too long");
            }
          }}
        />
      </label>
    </>
  );
};
