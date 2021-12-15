import { useSail } from "@saberhq/sail";
import { useSolana } from "@saberhq/use-solana";
import type { TransactionInstruction } from "@solana/web3.js";
import { GovernorWrapper } from "@tribecahq/tribeca-sdk";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import invariant from "tiny-invariant";

import { useSDK } from "../../../../../contexts/sdk";
import { notify } from "../../../../../utils/notifications";
import { Button } from "../../../../common/Button";
import type { ModalProps } from "../../../../common/Modal";
import { Modal } from "../../../../common/Modal";
import { useGovernor } from "../../hooks/useGovernor";

type Props = Omit<ModalProps, "children"> & {
  proposal: {
    title: string;
    description: string;
    instructions: TransactionInstruction[];
  };
};

export const ProposalConfirmModal: React.FC<Props> = ({
  proposal,
  ...modalProps
}: Props) => {
  const { network } = useSolana();
  const { sdk, tribecaMut } = useSDK();
  const { governor, path } = useGovernor();
  const { handleTX } = useSail();
  const history = useHistory();

  return (
    <Modal tw="p-0 dark:text-white" {...modalProps}>
      <div tw="h-14 flex items-center px-8 border-b dark:border-warmGray-700">
        <h1 tw="font-medium text-base">Proposal: {proposal.title}</h1>
      </div>
      <div tw="px-8 py-4 grid gap-4">
        <div tw="bg-primary bg-opacity-20 text-primary border border-primary rounded text-sm px-4 py-2">
          Tip: The proposal cannot be modified after submission, so please
          verify all information before submitting. If and when the proposal is
          activated, the voting period will begin and last for 3 days.
        </div>
        <div tw="prose prose-sm prose-light">{proposal.description}</div>
        {network !== "localnet" && proposal.instructions.length > 0 && (
          <a
            tw="text-sm text-primary hover:text-white transition-colors flex items-center gap-2"
            href={sdk.provider
              .newTX(proposal.instructions)
              .generateInspectLink(network)}
            target="_blank"
            rel="noreferrer"
          >
            <span>Inspect on Solana Explorer</span>
            <FaExternalLinkAlt />
          </a>
        )}
      </div>
      <div tw="px-8 flex justify-end py-4 border-t border-warmGray-700">
        <Button
          disabled={!tribecaMut}
          variant="primary"
          onClick={async () => {
            invariant(tribecaMut);
            const gov = new GovernorWrapper(tribecaMut, governor);
            const createProposal = await gov.createProposal({
              instructions: proposal.instructions,
            });
            const createProposalMetaTX = await gov.createProposalMeta({
              proposal: createProposal.proposal,
              title: proposal.title,
              descriptionLink: proposal.description,
            });
            const { pending, success } = await handleTX(
              createProposal.tx.combine(createProposalMetaTX),
              "Create Proposal"
            );
            if (!success || !pending) {
              return;
            }
            await pending.wait();
            notify({
              message: "Proposal created",
            });
            history.push(
              `${path}/proposals/${createProposal.index.toString()}`
            );
            modalProps.onDismiss();
          }}
        >
          Propose Transaction
        </Button>
      </div>
    </Modal>
  );
};
