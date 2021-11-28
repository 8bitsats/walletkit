import { FaCheckCircle, FaQuestionCircle } from "react-icons/fa";

import { useSmartWallet } from "../../../../../hooks/useSmartWallet";
import { AddressLink } from "../../../../common/AddressLink";
import { useTransaction } from "../context";

export const TXSidebar: React.FC = () => {
  const { smartWallet } = useSmartWallet();
  const { tx, title } = useTransaction();
  return (
    <>
      <div tw="text-xs font-semibold text-gray-500 border-b pb-2">{title}</div>
      <div tw="text-xs mt-4">
        <div tw="flex mb-4">
          <span tw="text-secondary w-[90px]">Key</span>
          <span>
            <AddressLink address={tx.accountId} showCopy />
          </span>
        </div>
        <div tw="flex mb-4">
          <span tw="text-secondary w-[90px]">Status</span>
          <span>{tx.accountInfo.data.executedAt.toNumber()}</span>
        </div>
        <div tw="flex mb-4">
          <span tw="text-secondary w-[90px]">Signers</span>
          <div tw="grid gap-1">
            {(tx.accountInfo.data.signers as boolean[]).map((signer, i) => {
              const currSigner = smartWallet?.data?.owners?.[i];
              if (currSigner) {
                return (
                  <div tw="flex items-center gap-2">
                    <AddressLink address={currSigner} />
                    {signer ? (
                      <FaCheckCircle tw="text-primary" />
                    ) : (
                      <FaQuestionCircle tw="text-gray-500" />
                    )}
                  </div>
                );
              }
            })}
          </div>
        </div>
        <div tw="flex mb-4">
          <span tw="text-secondary w-[90px]">Proposer</span>
          <span>
            <AddressLink address={tx.accountInfo.data.proposer} showCopy />
          </span>
        </div>
      </div>
    </>
  );
};
