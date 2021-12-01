import { useSail } from "@saberhq/sail";
import type { PublicKey } from "@solana/web3.js";
import copyToClipboard from "copy-to-clipboard";
import filesize from "filesize";
import { FaDownload, FaRegCopy } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import invariant from "tiny-invariant";

import type { ProgramDeployBuffer } from "../../../../../hooks/useAuthorityPrograms";
import { useSha256Sum } from "../../../../../hooks/useSha256Sum";
import { useSmartWallet } from "../../../../../hooks/useSmartWallet";
import { createUpgradeInstruction } from "../../../../../utils/instructions/upgradeable_loader/instructions";
import { notify } from "../../../../../utils/notifications";
import { AddressLink } from "../../../../common/AddressLink";
import { AsyncButton } from "../../../../common/AsyncButton";
import { LoadingSpinner } from "../../../../common/LoadingSpinner";

interface Props {
  buffer: ProgramDeployBuffer;
  programID: PublicKey;
}

export const BufferCard: React.FC<Props> = ({ buffer, programID }: Props) => {
  const { smartWallet, key, path } = useSmartWallet();
  const hash = useSha256Sum(buffer.executableData);
  const { handleTX } = useSail();
  const history = useHistory();
  return (
    <div tw="flex items-center justify-between rounded bg-gray-50 border px-3 py-2 text-sm">
      <div tw="flex flex-grow gap-4">
        <div tw="flex-basis[125px] flex items-center font-medium">
          <AddressLink address={buffer.pubkey} />
        </div>
        <div>
          <div tw="flex items-center gap-1 text-secondary">
            <button
              tw="hover:text-primary flex items-center gap-1"
              onClick={() => {
                const blob = new Blob([buffer.executableData], {
                  type: "application/octet-stream",
                });
                const link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                const fileName = `goki-${buffer.pubkey.toString()}.so`;
                link.download = fileName;
                link.click();
              }}
            >
              <span>Download ({filesize(buffer.dataLen)})</span>
              <FaDownload />
            </button>
          </div>
          <div tw="text-xs inline-flex gap-1 text-secondary">
            <span>SHA256:</span>
            {hash.data ? (
              <button
                type="button"
                tw="flex items-center gap-0.5 text-DEFAULT max-w-[200px] hover:(text-primary underline)"
                onClick={() => {
                  copyToClipboard(hash.data);
                  notify({
                    message: `Copied SHA256 hash to clipboard.`,
                    description: (
                      <>
                        You may verify the hash locally with{" "}
                        <code>sha256sum &lt;PROGRAM_FILEPATH&gt;</code>.
                      </>
                    ),
                  });
                }}
              >
                <span tw="overflow-hidden overflow-ellipsis flex-grow-0">
                  {hash.data}
                </span>
                <div tw="flex-grow w-4 h-4 flex items-center">
                  <FaRegCopy />
                </div>
              </button>
            ) : hash.isLoading ? (
              <LoadingSpinner />
            ) : (
              <span tw="text-red-500">error computing hash</span>
            )}
          </div>
        </div>
      </div>
      <div tw="flex items-center gap-2">
        <AsyncButton
          onClick={async () => {
            invariant(smartWallet);
            const { tx, index } = await smartWallet.newTransaction({
              instructions: [
                await createUpgradeInstruction({
                  program: programID,
                  buffer: buffer.pubkey,
                  spill: key,
                  signer: key,
                }),
              ],
            });
            const { pending, success } = await handleTX(tx, `Propose Upgrade`);
            if (!success || !pending) {
              return;
            }
            await pending.wait();
            history.push(`${path}/tx/${index}`);
          }}
        >
          Deploy
        </AsyncButton>
      </div>
    </div>
  );
};
