import { useSail } from "@saberhq/sail";
import { buildStubbedTransaction } from "@saberhq/solana-contrib";
import { useSolana } from "@saberhq/use-solana";
import type { TransactionInstruction } from "@solana/web3.js";
import { GovernorWrapper } from "@tribecahq/tribeca-sdk";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import invariant from "tiny-invariant";

import { useSDK } from "../../../../../../contexts/sdk";
import { notify } from "../../../../../../utils/notifications";
import { HelperCard } from "../../../../../common/HelperCard";
import type { ModalProps } from "../../../../../common/Modal";
import { Modal } from "../../../../../common/Modal";
import { ModalInner } from "../../../../../common/Modal/ModalInner";
import { useGovernor, useGovernorParams } from "../../../hooks/useGovernor";
import { ProposalIX } from "./ProposalIX";

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
  const { tribecaMut } = useSDK();
  const { governor, path, minActivationThreshold } = useGovernor();
  const { votingPeriodFmt } = useGovernorParams();
  const { handleTX } = useSail();
  const history = useHistory();

  const doProposeTransaction = async () => {
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
      message: `Proposal ${`000${createProposal.index.toString()}`.slice(
        -4
      )} created`,
    });
    history.push(`${path}/proposals/${createProposal.index.toString()}`);
    modalProps.onDismiss();
  };

  return (
    <Modal tw="p-0 dark:text-white" {...modalProps}>
      <ModalInner
        title={`Proposal: ${proposal.title}`}
        buttonProps={{
          disabled: !tribecaMut,
          variant: "primary",
          onClick: doProposeTransaction,
          children: "Propose Transaction",
        }}
      >
        <div tw="py-4 grid gap-4">
          <HelperCard>
            <p tw="mb-1">
              Tip: The proposal cannot be modified after submission, so please
              verify all information before submitting.
            </p>
            <p>
              Once submitted, anyone with at least{" "}
              {minActivationThreshold?.formatUnits()} may start the voting
              period, i.e., activate the proposal. The voting period will then
              immediately begin and last for {votingPeriodFmt}.
            </p>
          </HelperCard>
          <div tw="break-words hyphens[auto]">
            <div tw="prose prose-sm prose-light">{proposal.description}</div>
          </div>
          <div tw="flex flex-col gap-1.5">
            {proposal.instructions.map((ix, i) => (
              <ProposalIX key={i} ix={ix} />
            ))}
          </div>
          {network !== "localnet" && proposal.instructions.length > 0 && (
            <a
              tw="text-sm text-primary hover:text-white transition-colors flex items-center gap-2"
              href={`https://${
                network === "mainnet-beta" ? "" : `${network}.`
              }anchor.so/tx/inspector?message=${encodeURIComponent(
                buildStubbedTransaction(network, proposal.instructions)
                  .serializeMessage()
                  .toString("base64")
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              <span>Preview on Anchor.so</span>
              <FaExternalLinkAlt />
            </a>
          )}
        </div>
      </ModalInner>
    </Modal>
  );
};
