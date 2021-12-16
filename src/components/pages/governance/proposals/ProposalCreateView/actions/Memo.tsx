import { utils } from "@project-serum/anchor";
import {
  buildStubbedTransaction,
  MEMO_PROGRAM_ID,
} from "@saberhq/solana-contrib";
import { TransactionInstruction } from "@solana/web3.js";
import { useState } from "react";
import invariant from "tiny-invariant";

import { serializeToBase64 } from "../../../../../../utils/makeTransaction";
import { HelperCard } from "../../../../../common/HelperCard";
import { Textarea } from "../../../../../common/inputs/InputText";
import { useGovernor } from "../../../hooks/useGovernor";

interface Props {
  setTxRaw: (txRaw: string) => void;
}

export const Memo: React.FC<Props> = ({ setTxRaw }: Props) => {
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
            setTxRaw(
              serializeToBase64(
                buildStubbedTransaction("devnet", [
                  new TransactionInstruction({
                    programId: MEMO_PROGRAM_ID,
                    keys: [
                      {
                        pubkey: smartWallet,
                        isWritable: false,
                        isSigner: true,
                      },
                    ],
                    data: Buffer.from(utils.bytes.utf8.encode(memo)),
                  }),
                ])
              )
            );
          }}
        />
      </label>
    </>
  );
};
