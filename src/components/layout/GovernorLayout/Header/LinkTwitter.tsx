import { ClaimCard } from "@cardinal/namespaces-components";
import { useConnectedWallet, useConnectionContext } from "@saberhq/use-solana";

import { notify } from "../../../../utils/notifications";
import type { ModalProps } from "../../../common/Modal";
import { Modal } from "../../../common/Modal";

type Props = Omit<ModalProps, "children">;

export const LinkTwitter: React.FC<Props> = ({ ...modalProps }: Props) => {
  const { connection } = useConnectionContext();
  const wallet = useConnectedWallet();

  return (
    <Modal {...modalProps} tw="p-0">
      <div tw="grid gap-3 py-3">
        <div tw="mt-10 px-7 text-center">
          <h2 tw="font-bold text-xl">Link Twitter</h2>
        </div>
        <div tw="flex justify-center mb-10">
          <ClaimCard connection={connection} wallet={wallet} notify={notify} />
          {/* <NameEntryClaim
            connection={connection}
            wallet={wallet}
            entryName="jeremy"
            notify={notify}
          /> */}
        </div>
      </div>
    </Modal>
  );
};
