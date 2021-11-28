import copyToClipboard from "copy-to-clipboard";
import { FaCheckCircle, FaLink, FaQuestionCircle } from "react-icons/fa";

import { useSmartWallet } from "../../../../../hooks/useSmartWallet";
import { notify } from "../../../../../utils/notifications";
import { AddressLink } from "../../../../common/AddressLink";
import { useTransaction } from "../context";

export const TXSidebar: React.FC = () => {
  const { smartWallet } = useSmartWallet();
  const { tx, title, executedAt, eta } = useTransaction();
  return (
    <>
      <div tw="text-xs border-b pb-2">
        <div tw="flex">
          <span tw="font-semibold text-secondary w-[90px]">{title}</span>
          <div tw="text-secondary">
            <FaLink
              onClick={() => {
                copyToClipboard(window.location.href);
                notify({
                  message: "Transaction link copied to clipboard.",
                  description: "Paste it wherever you like.",
                });
              }}
            />
          </div>
        </div>
      </div>
      <div tw="text-xs mt-4">
        <div tw="flex mb-4">
          <span tw="text-secondary w-[90px]">Key</span>
          <span>
            <AddressLink address={tx.accountId} showCopy />
          </span>
        </div>
        <div tw="flex mb-4">
          <span tw="text-secondary w-[90px]">ETA</span>
          <span>
            {eta?.toLocaleString(undefined, {
              timeZoneName: "short",
            }) ?? "--"}
          </span>
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
        <div tw="flex mb-4">
          <span tw="text-secondary w-[90px]">Executed At</span>
          <span>
            {executedAt?.toLocaleString(undefined, {
              timeZoneName: "short",
            }) ?? "--"}
          </span>
        </div>
        {executedAt && (
          <div tw="flex mb-4">
            <span tw="text-secondary w-[90px]">Executor</span>
            <span>
              <AddressLink address={tx.accountInfo.data.executor} showCopy />
            </span>
          </div>
        )}
      </div>
    </>
  );
};
