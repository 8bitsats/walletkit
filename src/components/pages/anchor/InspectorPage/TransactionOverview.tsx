import type { Message } from "@solana/web3.js";
import { useMemo } from "react";

import { AttributeList } from "../../../common/AttributeList";
import { Card } from "../../../common/governance/Card";
import { AddressWithContext } from "../../../common/program/AddressWithContext";
import { SolAmount } from "../../../common/program/SolAmount";

interface Props {
  raw: Buffer;
  message: Message;
}

const DEFAULT_FEES = {
  lamportsPerSignature: 5000,
};

export const TransactionOverview: React.FC<Props> = ({
  raw,
  message,
}: Props) => {
  const size = useMemo(() => {
    const sigBytes = 1 + 64 * message.header.numRequiredSignatures;
    return sigBytes + raw.length;
  }, [message, raw]);

  const fee =
    message.header.numRequiredSignatures * DEFAULT_FEES.lamportsPerSignature;

  const feePayer = message.accountKeys[0];

  return (
    <Card title="Transaction Overview" tw="pb-2">
      <AttributeList
        attributes={{
          "Serialized Size": `${size} bytes`,
          Fees: <SolAmount lamports={fee} />,
          "Fee Payer": !feePayer ? (
            "No Fee Payer"
          ) : (
            <AddressWithContext pubkey={feePayer} />
          ),
        }}
      />
    </Card>
  );
};
